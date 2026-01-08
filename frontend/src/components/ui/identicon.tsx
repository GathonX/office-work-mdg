import React from "react";

function hashString(str: string): number {
  let h = 2166136261 >>> 0; // FNV-1a like
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hslFromHash(h: number) {
  const hue = h % 360;
  const sat = 65; // percent
  const light = 50; // percent
  return `hsl(${hue} ${sat}% ${light}%)`;
}

export default function Identicon({ value, size = 32, className }: { value: string; size?: number; className?: string }) {
  const h = hashString(value || "");
  const color = hslFromHash(h);
  const bg = "hsl(0 0% 100%)";
  const cells = 5;
  const cellSize = size / cells;
  const bits: boolean[] = [];
  // Generate 15 bits (5x3), mirror horizontally to 5x5
  let seed = h;
  for (let i = 0; i < cells * Math.ceil(cells / 2); i++) {
    seed = (seed ^ (seed << 13)) >>> 0;
    seed = (seed ^ (seed >>> 17)) >>> 0;
    seed = (seed ^ (seed << 5)) >>> 0; // xorshift32
    bits.push((seed & 1) === 1);
  }
  const rects: JSX.Element[] = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < Math.ceil(cells / 2); x++) {
      const idx = y * Math.ceil(cells / 2) + x;
      if (bits[idx]) {
        const rx = x * cellSize;
        const ry = y * cellSize;
        rects.push(<rect key={`l-${x}-${y}`} x={rx} y={ry} width={cellSize} height={cellSize} fill={color} />);
        const mx = (cells - 1 - x) * cellSize;
        if (mx !== rx) {
          rects.push(<rect key={`r-${x}-${y}`} x={mx} y={ry} width={cellSize} height={cellSize} fill={color} />);
        }
      }
    }
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
      role="img"
    >
      <rect x={0} y={0} width={size} height={size} fill={bg} />
      {rects}
    </svg>
  );
}
