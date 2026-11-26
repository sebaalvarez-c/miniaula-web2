import React from 'react';

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-brand-light dark:bg-brand-900/20 flex items-center justify-center text-4xl">
        📭
      </div>
      <div>
        <p className="text-primary font-semibold text-lg">{title}</p>
        {subtitle && <p className="text-muted text-sm mt-1 max-w-xs">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
