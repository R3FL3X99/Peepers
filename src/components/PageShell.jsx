export default function PageShell({ eyebrow, title, description, children }) {
  return (
    <section className="mt-12">
      <div className="glass rounded-3xl p-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-aurora">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            {title}
          </h2>
          <p className="max-w-2xl text-sm text-haze">{description}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">{children}</div>
      </div>
    </section>
  );
}
