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
      <span className={`${sizeClasses[size]} font-extrabold tracking-tight text-gray-900 font-sans`}>
        Gogangs<span className="text-[#e11d48]">.</span>
      </span>
    </div>
  );
}

