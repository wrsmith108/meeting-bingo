import { cn } from '../../lib/utils';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
        variant === 'ghost' && 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
