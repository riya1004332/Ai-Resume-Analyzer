import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-xl border border-slate-200/80 shadow-sm p-6',
          hover && 'transition-all duration-200 hover:shadow-md hover:border-slate-300',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

