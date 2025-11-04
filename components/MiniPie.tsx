'use client';

/**
 * Mini Pie Chart Component
 * Interactive vanilla canvas pie chart for category breakdown
 */

import { useEffect, useRef, useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface MiniPieProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export default function MiniPie({ data, width = 200, height = 200 }: MiniPieProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return;

    // Draw pie chart
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    let currentAngle = -Math.PI / 2; // Start at top

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const color = item.color || COLORS[index % COLORS.length];
      const isHovered = hoveredIndex === index;

      // Draw slice with hover effect
      const sliceRadius = isHovered ? radius + 10 : radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, sliceRadius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = isHovered ? 4 : 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });
  }, [data, width, height, hoveredIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius + 10) {
      setHoveredIndex(null);
      return;
    }

    const angle = Math.atan2(dy, dx) + Math.PI / 2;
    const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i].value / total) * 2 * Math.PI;
      if (normalizedAngle >= currentAngle && normalizedAngle < currentAngle + sliceAngle) {
        setHoveredIndex(i);
        return;
      }
      currentAngle += sliceAngle;
    }

    setHoveredIndex(null);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="rounded-lg cursor-pointer transition-all"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        {hoveredIndex !== null && (
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm pointer-events-none z-10"
            style={{
              left: `${mousePos.x + 10}px`,
              top: `${mousePos.y - 40}px`,
            }}
          >
            <div className="font-bold">{data[hoveredIndex].label}</div>
            <div className="text-xs">
              {data[hoveredIndex].value} seats ({((data[hoveredIndex].value / total) * 100).toFixed(1)}%)
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        {data.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 text-sm transition-all cursor-pointer p-1 rounded ${
              hoveredIndex === index ? 'bg-gray-100 scale-105' : ''
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: item.color || COLORS[index % COLORS.length],
              }}
            />
            <span className={`${hoveredIndex === index ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
              {item.label}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
