'use client';

/**
 * Mini Line Chart Component
 * Simple vanilla canvas line chart for member growth over time
 */

import { useEffect, useRef } from 'react';

interface DataPoint {
  date: string;
  value: number;
}

interface MiniLineProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
}

export default function MiniLine({
  data,
  width = 280,
  height = 80,
  color = '#4b5563',
}: MiniLineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) return;

    // Find min/max values
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Padding
    const padding = { top: 10, right: 10, bottom: 20, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Scale functions
    const xScale = (index: number) =>
      padding.left + (index / (data.length - 1)) * chartWidth;

    const yScale = (value: number) => {
      const range = maxValue - minValue || 1;
      return padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
    };

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = xScale(index);
      const y = yScale(point.value);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = color;
    data.forEach((point, index) => {
      const x = xScale(index);
      const y = yScale(point.value);

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw axes labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';

    // Y-axis labels
    for (let i = 0; i <= 4; i++) {
      const value = minValue + ((maxValue - minValue) / 4) * (4 - i);
      const y = padding.top + (i / 4) * chartHeight;
      ctx.fillText(Math.round(value).toString(), padding.left - 5, y + 3);
    }

    // X-axis labels (first and last date)
    ctx.textAlign = 'center';
    if (data.length > 0) {
      const firstDate = new Date(data[0].date).toLocaleDateString('en-AU', {
        month: 'short',
        day: 'numeric',
      });
      const lastDate = new Date(data[data.length - 1].date).toLocaleDateString('en-AU', {
        month: 'short',
        day: 'numeric',
      });

      ctx.fillText(firstDate, padding.left, height - 5);
      ctx.fillText(lastDate, width - padding.right, height - 5);
    }
  }, [data, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg"
    />
  );
}
