type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  children: React.ReactNode;
};

export function Select({ label, error, children, className = "", ...props }: SelectProps) {
  const select = (
    <select
      aria-invalid={Boolean(error)}
      className={`focus-ring min-h-11 w-full rounded-md border bg-white px-3 py-2.5 text-sm text-ink shadow-sm ${
        error ? "border-accent bg-red-50/40" : "border-line"
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );

  if (!label) return select;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      {select}
      {error && <span className="mt-1.5 block text-sm font-medium text-accent">{error}</span>}
    </label>
  );
}
