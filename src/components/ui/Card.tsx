import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <article className={`rounded-2xl border border-border p-5 shadow-sm ${className || 'bg-surface'}`}>
      {children}
    </article>
  );
}
