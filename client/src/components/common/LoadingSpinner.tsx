import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string; className?: string }> = ({
  size = 'md',
  text,
  className
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  return (
    <div className={twMerge(clsx('flex flex-col items-center justify-center p-6 text-slate-500 gap-2', className))}>
      <Loader2 className={twMerge(clsx('animate-spin text-indigo-600', sizes[size]))} />
      {text && <p className="text-sm font-medium text-slate-600">{text}</p>}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge(clsx('animate-pulse bg-slate-200 rounded-md', className))} />
  );
};

