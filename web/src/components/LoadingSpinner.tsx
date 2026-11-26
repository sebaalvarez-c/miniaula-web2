export function LoadingSpinner({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-theme border-t-accent animate-spin" />
      <p className="text-subtle text-xs">{text}</p>
    </div>
  );
}
