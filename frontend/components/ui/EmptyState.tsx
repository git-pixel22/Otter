import { OtterMark } from './Icons';

export function EmptyState({
  title = 'Nothing here yet',
  hint,
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-14 text-center">
      <OtterMark size={54} className="float-bob text-faint opacity-70" />
      <p className="font-display text-lg font-semibold tracking-tight">{title}</p>
      {hint && <p className="max-w-[34ch] text-sm leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}
