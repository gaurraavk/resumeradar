import React from 'react';

interface DotMatrixProps {
  rows?: number;
  cols?: number;
  className?: string;
  dotSize?: number;
}

export const DotMatrix: React.FC<DotMatrixProps> = ({
  rows = 3,
  cols = 3,
  className = '',
  dotSize = 2,
}) => {
  return (
    <div
      className={`inline-grid gap-1.5 select-none pointer-events-none opacity-30 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${dotSize}px)`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span
          key={i}
          className="rounded-full bg-[#15263c]"
          style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
        />
      ))}
    </div>
  );
};

