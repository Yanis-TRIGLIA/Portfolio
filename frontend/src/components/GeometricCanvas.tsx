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
  const animationFrameRef = useRef<number>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const isInitialized = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMouseOverCanvasRef = useRef(false);

  const nodeColors = [
    '#64748b', // slate
    '#6b7280', // gray
    '#71717a', // zinc
    '#737373', // neutral
    '#78716c', // stone
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isInitialized.current) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize network nodes
    const initialNodes: Node[] = [];
    const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 20000); // More nodes
    
    for (let i = 0; i < nodeCount; i++) {
      const size = Math.random() * 8 + 4; // Smaller nodes like network points
      initialNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: size,
        originalSize: size,
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        vx: (Math.random() - 0.5) * 1, // Slightly faster base movement
        vy: (Math.random() - 0.5) * 1,
        glowIntensity: 0,
        connections: []
      });
    }

    // Create connections between nearby nodes (network effect)
    initialNodes.forEach((node, i) => {
      initialNodes.forEach((otherNode, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          // Connect nodes that are close enough - more connections
          if (distance < 180 && Math.random() > 0.5) {
            node.connections.push(j);
          }
        }
      });
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
    
    // Glow effect for active nodes
    if (node.glowIntensity > 0) {
      ctx.shadowBlur = 20 * node.glowIntensity;
      ctx.shadowColor = '#3b82f6';
    }
    
    // Draw node as a small circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();
    
    // Add a bright center for active nodes
    if (node.glowIntensity > 0) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${node.glowIntensity * 0.8})`;
      ctx.fill();
    }
    
    ctx.restore();
  };

  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    nodes.forEach((node, i) => {
      node.connections.forEach(connectionIndex => {
        const connectedNode = nodes[connectionIndex];
        if (connectedNode) {
          const distance = Math.sqrt(
            Math.pow(node.x - connectedNode.x, 2) + Math.pow(node.y - connectedNode.y, 2)
          );
          
          // Only draw connection if nodes are still close enough
          if (distance < 250) {
            // Check if mouse is near this connection line
            const mouseDistance = getDistanceToLine(
              mouseRef.current.x, 
              mouseRef.current.y,
              node.x, 
              node.y, 
              connectedNode.x, 
              connectedNode.y
            );
            
            let opacity = 0.6 * (1 - distance / 250); // Base opacity - much brighter
            let lineWidth = 1;
            
            // Enhance connection if mouse is nearby
            if (isMouseOverCanvasRef.current && mouseDistance < 30) {
              opacity = Math.min(1, opacity + 0.4);
              lineWidth = 2;
              ctx.shadowBlur = 5;
              ctx.shadowColor = '#60a5fa';
            } else {
              ctx.shadowBlur = 0;
            }
            
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`; // Much brighter color
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();
          }
        }
      });
    });
  };

  const getDistanceToLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getDistanceToMouse = (node: Node): number => {
    const dx = mouseRef.current.x - node.x;
    const dy = mouseRef.current.y - node.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with dark background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections first (behind nodes)
    drawConnections(ctx);

    // Update and draw nodes
    nodes.forEach(node => {
      // Mouse interaction effects
      if (isMouseOverCanvasRef.current) {
        const distance = getDistanceToMouse(node);
        const interactionRadius = 200; // Even larger interaction radius
        
        if (distance < interactionRadius) {
          // Mouse attraction/movement effect - much stronger forces
          const dx = node.x - mouseRef.current.x;
          const dy = node.y - mouseRef.current.y;
          
          let force;
          if (distance < 80) {
            // Close to mouse: strong repulsion
            force = (80 - distance) / 80 * 0.08;
            node.vx += (dx / distance) * force;
            node.vy += (dy / distance) * force;
          } else {
            // Medium distance: stronger attraction
            force = (interactionRadius - distance) / interactionRadius * 0.025;
            node.vx -= (dx / distance) * force;
            node.vy -= (dy / distance) * force;
          }
          
          // Scale and glow effects
          const intensity = 1 - (distance / interactionRadius);
          node.size = node.originalSize * (1 + intensity * 0.8);
          node.glowIntensity = intensity * 0.9;
        } else {
          // Reset effects for distant nodes
          node.size = Math.max(node.originalSize, node.size - 0.15);
          node.glowIntensity = Math.max(0, node.glowIntensity - 0.03);
        }
      } else {
        // Reset effects when mouse leaves canvas
        node.size = Math.max(node.originalSize, node.size - 0.15);
        node.glowIntensity = Math.max(0, node.glowIntensity - 0.03);
      }

      // Update position with slow drift
      node.x += node.vx;
      node.y += node.vy;

      // Add friction
      node.vx *= 0.98;
      node.vy *= 0.98;

      // Soft boundary constraints (nodes drift back when too far)
      const margin = 50;
      if (node.x < -margin) node.vx += 0.001;
      if (node.x > canvas.width + margin) node.vx -= 0.001;
      if (node.y < -margin) node.vy += 0.001;
      if (node.y > canvas.height + margin) node.vy -= 0.001;

      // Add slight random movement to keep network alive
      node.vx += (Math.random() - 0.5) * 0.001;
      node.vy += (Math.random() - 0.5) * 0.001;

      drawNode(ctx, node);
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (nodes.length > 0) {
      animate();
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current = { x, y };
  };

  const handleMouseEnter = () => {
    isMouseOverCanvasRef.current = true;
  };

  const handleMouseLeave = () => {
    isMouseOverCanvasRef.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};