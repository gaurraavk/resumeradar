import React from 'react';

export type GlassButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlassButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  loading?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const variantStyles: Record<GlassButtonVariant, string> = {
    primary:
      'bg-[#15263c] text-[#fbf9f4] hover:bg-[#1f3757] shadow-[0_4px_16px_rgba(21,38,60,0.18)] border border-[#15263c]',
    secondary:
      'bg-white/60 hover:bg-white/85 text-[#15263c] border border-white/80 shadow-[0_2px_12px_rgba(21,38,60,0.05)] backdrop-blur-md',
    ghost:
      'bg-transparent hover:bg-black/[0.04] text-[#15263c] border border-transparent',
    destructive:
      'bg-rose-500/15 hover:bg-rose-500/25 text-rose-800 border border-rose-500/30 backdrop-blur-md',
  };

  const sizeStyles = {
    sm: 'text-[12px] px-3.5 py-1.5 rounded-xl gap-1.5',
    md: 'text-[13.5px] px-5 py-2.5 rounded-2xl gap-2 font-medium',
    lg: 'text-[15px] px-8 py-3.5 rounded-2xl gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-[0.98] select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="material-symbols-outlined text-[17px] shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

