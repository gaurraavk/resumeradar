import React from 'react';
import { DotMatrix } from './DotMatrix';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'strong' | 'subtle';
  className?: string;
  dotMatrix?: boolean;
  hoverLift?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  dotMatrix = false,
  hoverLift = true,
}) => {
  const variantClass = {
    default: 'glass-card',
    strong: 'glass-strong',
    subtle: 'glass-subtle',
  }[variant];

  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-8 transition-all duration-300 ${variantClass} ${
        hoverLift ? 'hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(21,38,60,0.09)]' : ''
      } ${className}`}
    >
      {dotMatrix && (
        <div className="absolute top-4 right-4 pointer-events-none">
          <DotMatrix rows={3} cols={3} />
        </div>
      )}
      {children}
    </div>
  );
};

