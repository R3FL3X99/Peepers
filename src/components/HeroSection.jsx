const stats = [
  {
    label: "Active viewers",
    value: "24.8k",
    note: "Watching tonight",
  },
  {
    label: "Curated lists",
    value: "340+",
    note: "Updated weekly",
  },
  {
    label: "Premium access",
    value: "4K HDR",
    note: "Dolby Atmos",
  },
];

export default function HeroSection({ curated, featured }) {
  return (
    <section className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-aurora/30 bg-aurora/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-aurora">
          New release week
          <span className="h-1.5 w-1.5 rounded-full bg-aurora"></span>
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Stream stories that keep your pulse on the edge.
          </h2>
              <p className="max-w-xl text-base text-haze">
                Peepers blends premium premieres, iconic classics, and a
                mood-first discovery engine that learns what makes you hit play.
              </p>
        </div>
        <div className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4">
          <div className="flex-1">
            <input
              className="w-full bg-transparent text-sm text-white placeholder:text-haze focus:outline-none"
              placeholder="Search by title, director, or mood"
            />
          </div>
          <a
            href="#trending"
            className="rounded-full bg-ember px-5 py-2 text-sm font-semibold text-midnight transition hover:brightness-110"
          >
            Start watching
          </a>
        </div>
        <div className="flex flex-wrap gap-4">
          {stats.map((item) => (
            <div key={item.label} className="glass flex-1 rounded-2xl p-4">
              <p className="text-xs uppercase text-haze">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              <p className="text-xs text-haze">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -right-6 top-6 h-40 w-40 rounded-3xl border border-white/10 bg-white/5 blur-2xl" />
        <div className="glass relative overflow-hidden rounded-3xl p-6">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl text-midnight">
            {featured.image ? (
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src={featured.image}
                alt={featured.title}
              />
            ) : (
              <div className="poster absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white">
                <span>Featured</span>
                <span>Ultra HD</span>
              </div>
              <div className="space-y-2 text-white">
                <h3 className="text-2xl font-bold">{featured.title}</h3>
                <p className="text-sm">{featured.tagline}</p>
              </div>
            </div>
            <button className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-midnight shadow-glow transition hover:bg-white">
              ▶
            </button>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-haze">Next episode</p>
              <p className="text-sm font-semibold">{featured.time}</p>
            </div>
            <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-midnight">
              Watch trailer
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {curated.map((item) => (
            <div
              key={item.title}
              className="grid-glow rounded-2xl border border-white/5 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-haze">
                {item.tag}
              </p>
              <p className="mt-2 text-sm font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
