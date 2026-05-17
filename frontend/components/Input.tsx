type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <input
        aria-invalid={Boolean(error)}
        className={`focus-ring w-full rounded-md border bg-white px-3 py-2.5 text-sm text-ink shadow-sm ${
          error ? "border-accent bg-red-50/40" : "border-line"
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1.5 block text-sm font-medium text-accent">{error}</span>}
    </label>
  );
}
