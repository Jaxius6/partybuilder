'use client';

/**
 * Mini Pie Chart Component
 * Simple vanilla canvas pie chart for category breakdown
 */

import { useEffect, useRef } from 'react';

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

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });
  }, [data, width, height]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg"
      />
      <div className="mt-4 space-y-1">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: item.color || COLORS[index % COLORS.length],
              }}
            />
            <span className="text-gray-700">
              {item.label}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
