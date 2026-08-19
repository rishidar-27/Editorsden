import { useState, useEffect, type ButtonHTMLAttributes, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 ease-out-soft focus-ring disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  const sizes: Record<ButtonSize, string> = {
    sm: 'text-[13px] px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-sm px-5 py-2.5',
  };
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-violet-500 text-white hover:bg-violet-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 text-ink-900 bg-transparent hover:bg-gray-050',
    ghost: 'text-gray-700 hover:bg-gray-100',
    destructive: 'border border-red-500 text-red-500 bg-transparent hover:bg-red-050',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

type BadgeVariant = 'verified' | 'pending' | 'rejected' | 'neutral' | 'featured' | 'info' | 'overdue' | 'urgent' | 'inactive';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    verified: 'bg-mint-050 text-mint-700',
    pending: 'bg-amber-050 text-amber-700',
    rejected: 'bg-red-050 text-red-700',
    neutral: 'bg-gray-100 text-gray-700',
    featured: 'bg-coral-050 text-coral-700',
    info: 'bg-violet-050 text-violet-700',
    overdue: 'bg-red-050 text-red-700',
    urgent: 'bg-amber-050 text-amber-700',
    inactive: 'bg-gray-100 text-gray-500',
  };
  const dotColors: Record<BadgeVariant, string> = {
    verified: 'bg-mint-500',
    pending: 'bg-amber-500',
    rejected: 'bg-red-500',
    neutral: 'bg-gray-400',
    featured: 'bg-coral-500',
    info: 'bg-violet-500',
    overdue: 'bg-red-500',
    urgent: 'bg-amber-500',
    inactive: 'bg-gray-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-pill ${variants[variant]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      {children}
    </span>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-0 border border-gray-200 rounded-card ${hover ? 'transition-all duration-150 ease-out-soft hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-0.5' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20',
  };
  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover border border-gray-200 ${className}`}
    />
  );
}

interface AvatarStackProps {
  editors: { id: string; fullName: string; avatarUrl: string }[];
  max?: number;
  size?: 'sm' | 'md';
}

export function AvatarStack({ editors, max = 4, size = 'sm' }: AvatarStackProps) {
  const shown = editors.slice(0, max);
  const remaining = editors.length - shown.length;
  const sizeClass = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((e) => (
        <img
          key={e.id}
          src={e.avatarUrl}
          alt={e.fullName}
          className={`${sizeClass} rounded-full object-cover border-2 border-surface-0`}
        />
      ))}
      {remaining > 0 && (
        <div className={`${sizeClass} rounded-full bg-gray-100 border-2 border-surface-0 flex items-center justify-center text-xs font-medium text-gray-600`}>
          +{remaining}
        </div>
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          className={`w-full px-3 py-2 text-sm bg-surface-0 border rounded-lg transition-colors duration-150 focus-ring placeholder:text-gray-400 ${
            error ? 'border-red-300' : 'border-gray-200'
          } ${icon ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <textarea
        className={`w-full px-3 py-2 text-sm bg-surface-0 border rounded-lg transition-colors duration-150 focus-ring placeholder:text-gray-400 resize-none ${
          error ? 'border-red-300' : 'border-gray-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        <select
          className={`w-full appearance-none px-3 py-2 pr-9 text-sm bg-surface-0 border rounded-lg transition-colors duration-150 focus-ring ${
            error ? 'border-red-300' : 'border-gray-200'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface SkillTagProps {
  children: ReactNode;
  onRemove?: () => void;
  className?: string;
}

export function SkillTag({ children, onRemove, className = '' }: SkillTagProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md ${className}`}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-gray-900 transition-colors">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  animateOnMount?: boolean;
}

export function ProgressBar({ value, max = 100, className = '', animateOnMount = false }: ProgressBarProps) {
  const [width, setWidth] = useState(animateOnMount ? 0 : (value / max) * 100);
  useEffect(() => {
    if (animateOnMount) {
      const timer = setTimeout(() => setWidth((value / max) * 100), 100);
      return () => clearTimeout(timer);
    }
    setWidth((value / max) * 100);
  }, [value, max, animateOnMount]);

  return (
    <div className={`w-full h-1.5 bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-violet-500 rounded-full transition-all duration-300 ease-out-soft"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}



interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export function Checkbox({ checked, onChange, className = '' }: CheckboxProps) {
  return (
    <button
      onClick={onChange}
      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-150 focus-ring ${
        checked ? 'bg-violet-500 border-violet-500' : 'border-gray-300 bg-surface-0 hover:border-gray-400'
      } ${className}`}
    >
      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </button>
  );
}

interface KebabMenuProps {
  items: { label: string; onClick: () => void; variant?: 'default' | 'destructive' }[];
}

export function KebabMenu({ items }: KebabMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus-ring"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-surface-0 border border-gray-200 rounded-lg shadow-lg py-1 z-50 animate-scale-in">
          {items.map((item, i) => (
            <button
              key={i}
              onMouseDown={item.onClick}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                item.variant === 'destructive' ? 'text-red-500 hover:bg-red-050' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`bg-gray-100 rounded animate-pulse-skeleton ${className}`} />;
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-gray-400 mb-3">{icon}</div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className = '' }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-950/30" />
      <div
        className={`relative bg-surface-0 rounded-card border border-gray-200 shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto scrollbar-thin animate-scale-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-surface-0 z-10">
          <h2 className="text-base font-semibold text-ink-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors focus-ring">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: { id: string; message: string; variant: 'success' | 'error' | 'info' }[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md animate-toast-in bg-surface-0 ${
            toast.variant === 'success' ? 'border-mint-200' : toast.variant === 'error' ? 'border-red-200' : 'border-gray-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${toast.variant === 'success' ? 'bg-mint-500' : toast.variant === 'error' ? 'bg-red-500' : 'bg-violet-500'}`} />
          <span className="text-sm text-gray-800 flex-1">{toast.message}</span>
          <button onClick={() => onRemove(toast.id)} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
