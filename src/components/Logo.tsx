import logoImg from '../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 'md', variant = 'light', className = '' }: LogoProps) {
  const heightClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-11',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoImg}
        alt="Gogangs Logo"
        className={`${heightClasses[size]} w-auto object-contain select-none`}
        style={
          variant === 'light'
            ? { filter: 'invert(1) hue-rotate(180deg)' }
            : undefined
        }
      />
    </div>
  );
}

