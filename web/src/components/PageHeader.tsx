interface PageHeaderProps {
  title: string;
  onBack: () => void;
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack} className="text-muted hover:text-primary transition-colors">
        ←
      </button>
      <h1 className="text-xl font-bold text-primary">{title}</h1>
    </div>
  );
}
