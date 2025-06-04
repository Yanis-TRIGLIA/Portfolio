import React, { useRef, useEffect, useState } from 'react';

interface Shape {
  x: number;
  y: number;
  size: number;
  type: 'circle' | 'square' | 'triangle' | 'hexagon' | 'diamond';
  color: string;
  vx: number;
  vy: number;
  isDragging: boolean;
  rotation: number;
  rotationSpeed: number;
}

export const GeometricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const draggedShapeRef = useRef<Shape | null>(null);
  const isInitialized = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMouseOverCanvasRef = useRef(false);

  const colors = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#E11D48'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isInitialized.current) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize more shapes with different types
    const initialShapes: Shape[] = [];
    for (let i = 0; i < 15; i++) {
      initialShapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 80 + 30,
        type: ['circle', 'square', 'triangle', 'hexagon', 'diamond'][Math.floor(Math.random() * 5)] as Shape['type'],
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        isDragging: false,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }
    setShapes(initialShapes);
    isInitialized.current = true;

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 2;
    ctx.translate(shape.x, shape.y);
    ctx.rotate(shape.rotation);

    switch (shape.type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      
      case 'square':
        ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        break;
      
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -shape.size / 2);
        ctx.lineTo(-shape.size / 2, shape.size / 2);
        ctx.lineTo(shape.size / 2, shape.size / 2);
        ctx.closePath();
        ctx.fill();
        break;

      case 'hexagon':
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * shape.size / 2;
          const y = Math.sin(angle) * shape.size / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;

      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -shape.size / 2);
        ctx.lineTo(shape.size / 2, 0);
        ctx.lineTo(0, shape.size / 2);
        ctx.lineTo(-shape.size / 2, 0);
        ctx.closePath();
        ctx.fill();
        break;
    }
    ctx.restore();
  };

  const isPointInShape = (x: number, y: number, shape: Shape): boolean => {
    const dx = x - shape.x;
    const dy = y - shape.y;
    
    switch (shape.type) {
      case 'circle':
        return Math.sqrt(dx * dx + dy * dy) <= shape.size / 2;
      case 'square':
      case 'diamond':
      case 'hexagon':
        return Math.abs(dx) <= shape.size / 2 && Math.abs(dy) <= shape.size / 2;
      case 'triangle':
        return Math.abs(dx) <= shape.size / 2 && Math.abs(dy) <= shape.size / 2;
      default:
        return false;
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(0.5, '#312e81');
    gradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(shape => {
      if (!shape.isDragging) {
        // Magnetic attraction to mouse when hovering
        if (isMouseOverCanvasRef.current) {
          const dx = mouseRef.current.x - shape.x;
          const dy = mouseRef.current.y - shape.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200) {
            const force = (200 - distance) / 200 * 0.05;
            shape.vx += (dx / distance) * force;
            shape.vy += (dy / distance) * force;
          }
        }

        // Update position with increased speed
        shape.x += shape.vx;
        shape.y += shape.vy;

        // Update rotation
        shape.rotation += shape.rotationSpeed;

        // Add friction
        shape.vx *= 0.995;
        shape.vy *= 0.995;

        // Bounce off walls with more energy
        if (shape.x <= shape.size / 2 || shape.x >= canvas.width - shape.size / 2) {
          shape.vx *= -1.1;
        }
        if (shape.y <= shape.size / 2 || shape.y >= canvas.height - shape.size / 2) {
          shape.vy *= -1.1;
        }

        // Keep shapes in bounds
        shape.x = Math.max(shape.size / 2, Math.min(canvas.width - shape.size / 2, shape.x));
        shape.y = Math.max(shape.size / 2, Math.min(canvas.height - shape.size / 2, shape.y));
      }

      drawShape(ctx, shape);
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (shapes.length > 0) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shapes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = shapes.length - 1; i >= 0; i--) {
      if (isPointInShape(x, y, shapes[i])) {
        draggedShapeRef.current = shapes[i];
        shapes[i].isDragging = true;
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current = { x, y };

    if (draggedShapeRef.current) {
      draggedShapeRef.current.x = x;
      draggedShapeRef.current.y = y;
    }
  };

  const handleMouseUp = () => {
    if (draggedShapeRef.current) {
      draggedShapeRef.current.isDragging = false;
      draggedShapeRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    isMouseOverCanvasRef.current = true;
  };

  const handleMouseLeave = () => {
    isMouseOverCanvasRef.current = false;
    if (draggedShapeRef.current) {
      draggedShapeRef.current.isDragging = false;
      draggedShapeRef.current = null;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};
