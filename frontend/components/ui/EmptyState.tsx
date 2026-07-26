export function EmptyState({ message = 'No tasks yet' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16" style={{ color: 'var(--text-muted)' }}>
      <span className="text-5xl select-none">🦦</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
