import { cn } from '../../lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: Props) {
  return (
    <div className={cn('bg-white rounded-xl shadow-md p-6', className)}>
      {children}
    </div>
  );
}
