import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  const hasBackground = /\bbg-/.test(className);

  return (
    <article
      className={`rounded-2xl border border-border p-5 shadow-sm ${hasBackground ? '' : 'bg-surface'} ${className}`}
    >
      {children}
    </article>
  );
}
