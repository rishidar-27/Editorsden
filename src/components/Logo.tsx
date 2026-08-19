interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showWordmark = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { circle: 'w-6 h-6', text: 'text-base' },
    md: { circle: 'w-8 h-8', text: 'text-lg' },
    lg: { circle: 'w-12 h-12', text: 'text-2xl' },
  };
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes[size].circle} rounded-full bg-ink-900 flex items-center justify-center shrink-0`}>
        <span className="text-white font-bold" style={{ fontSize: size === 'lg' ? '14px' : '10px' }}>G</span>
      </div>
      {showWordmark && (
        <span className={`${sizes[size].text} font-bold text-ink-900 tracking-tight`} style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}>
          Gogangs<span className="text-gray-400">.</span>
        </span>
      )}
    </div>
  );
}
