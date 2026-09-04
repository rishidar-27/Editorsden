interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      <span className={`${sizeClasses[size]} font-black tracking-tight text-gray-900 dark:text-white font-sans flex items-baseline`}>
        Gogangs<span className="text-pink-500 font-black text-[1.15em] leading-none ml-0.5">.</span>
      </span>
    </div>
  );
}

