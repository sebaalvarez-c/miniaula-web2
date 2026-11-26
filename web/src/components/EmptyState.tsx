import React from 'react';

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="text-4xl">📭</div>
      <p className="text-gray-700 font-medium">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm max-w-xs">{subtitle}</p>}
      {action}
    </div>
  );
}
