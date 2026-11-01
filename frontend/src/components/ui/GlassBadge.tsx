import React from 'react';

export type GlassBadgeVariant =
  | 'teal'
  | 'cyan'
  | 'peach'
  | 'coral'
  | 'lavender'
  | 'navy'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error';

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: GlassBadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  icon?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const variantStyles: Record<GlassBadgeVariant, string> = {
    teal: 'bg-[#9ec9c4]/20 text-[#2c5350] border-[#9ec9c4]/45',
    cyan: 'bg-[#15d6e6]/15 text-[#00606b] border-[#15d6e6]/35',
    peach: 'bg-[#f2b6a7]/25 text-[#7a392b] border-[#f2b6a7]/50',
    coral: 'bg-[#e98f7b]/20 text-[#823220] border-[#e98f7b]/40',
    lavender: 'bg-[#d9d0e8]/30 text-[#4c3f66] border-[#d9d0e8]/60',
    navy: 'bg-[#15263c]/10 text-[#15263c] border-[#15263c]/20',
    neutral: 'bg-black/[0.04] text-[#15263c] border-black/[0.06]',
    success: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/25',
    warning: 'bg-amber-500/15 text-amber-900 border-amber-500/25',
    error: 'bg-rose-500/15 text-rose-900 border-rose-500/25',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-[12px] px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-md transition-all duration-200 select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && (
        <span
          className="material-symbols-outlined shrink-0"
          style={{ fontSize: size === 'sm' ? '13px' : '15px' }}
        >
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

