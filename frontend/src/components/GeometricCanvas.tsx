import React, { useRef, useEffect, useState } from 'react';

interface Node {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  originalSize: number;
  glowIntensity: number;
  connections: number[];
}

export const GeometricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const isInitialized = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const mouseActiveRef = useRef(false);

  const nodeColors = ['#64748b', '#6b7280', '#71717a', '#737373', '#78716c'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isInitialized.current) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const initialNodes: Node[] = [];
    const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 20000);

    for (let i = 0; i < nodeCount; i++) {
      const size = Math.random() * 6 + 4;
      initialNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        originalSize: size,
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        glowIntensity: 0,
        connections: []
      });
    }

    // Connect nodes within a distance
    initialNodes.forEach((node, i) => {
      initialNodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && Math.random() > 0.5) {
            node.connections.push(j);
          }
        }
      });
    });

    // Ensure each node has at least one connection
    initialNodes.forEach((node, i) => {
      if (node.connections.length === 0) {
        let closestIndex = -1;
        let minDist = Infinity;
        initialNodes.forEach((other, j) => {
          if (i !== j) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
              minDist = dist;
              closestIndex = j;
            }
          }
        });
        if (closestIndex !== -1) {
          node.connections.push(closestIndex);
        }
      }
    });

    setNodes(initialNodes);
    isInitialized.current = true;

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawNode = (ctx: CanvasRenderingContext2D, node: Node) => {
    ctx.save();
    if (node.glowIntensity > 0) {
      ctx.shadowBlur = 20 * node.glowIntensity;
      ctx.shadowColor = '#3b82f6';
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();

    if (node.glowIntensity > 0) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${node.glowIntensity * 0.8})`;
      ctx.fill();
    }
    ctx.restore();
  };

  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    nodes.forEach((node) => {
      node.connections.forEach(connectionIndex => {
        const connectedNode = nodes[connectionIndex];
        if (!connectedNode) return;

        const dx = node.x - connectedNode.x;
        const dy = node.y - connectedNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.strokeStyle = `rgba(148, 163, 184, ${0.6 * (1 - dist / 250)})`;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      });
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawConnections(ctx);

    nodes.forEach(node => {
      const dx = mouseRef.current.x - node.x;
      const dy = mouseRef.current.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const interactionRadius = 180;

      if (mouseActiveRef.current && distance < interactionRadius) {
        const force = (interactionRadius - distance) / interactionRadius * 0.05;
        node.vx -= (dx / distance) * force;
        node.vy -= (dy / distance) * force;
        const intensity = 1 - distance / interactionRadius;
        node.size = node.originalSize * (1 + intensity * 0.8);
        node.glowIntensity = intensity * 0.9;
      } else {
        node.size = Math.max(node.originalSize, node.size - 0.1);
        node.glowIntensity = Math.max(0, node.glowIntensity - 0.02);
      }

      // Update positions
      node.vx += (Math.random() - 0.5) * 0.05;
      node.vy += (Math.random() - 0.5) * 0.05;

      node.vx *= 0.985;
      node.vy *= 0.985;

      node.x += node.vx;
      node.y += node.vy;

      const margin = 50;
      if (node.x < -margin) node.vx += 0.01;
      if (node.x > canvas.width + margin) node.vx -= 0.01;
      if (node.y < -margin) node.vy += 0.01;
      if (node.y > canvas.height + margin) node.vy -= 0.01;

      drawNode(ctx, node);
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (nodes.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { mouseActiveRef.current = true; }}
      onMouseLeave={() => { mouseActiveRef.current = false; }}
    />
  );
};
