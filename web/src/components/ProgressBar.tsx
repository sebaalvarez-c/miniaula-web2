export function ProgressBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct === 100 ? 'bg-emerald-500' : 'bg-accent';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
        <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted w-8 text-right">{pct}%</span>
    </div>
  );
}
