export function AuthFormShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-md py-6 sm:py-10">
      <div className="rounded-lg border border-line bg-white p-5 shadow-soft sm:p-6">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
