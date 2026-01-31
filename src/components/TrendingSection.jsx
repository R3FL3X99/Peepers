import { Link } from "react-router-dom";

export default function TrendingSection({ trending, upcoming }) {
  return (
    <section
      id="trending"
      className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold">Trending now</h3>
          <button className="text-sm text-haze">View all</button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {trending.map((movie) => {
            const Card = movie.id ? Link : "div";
            const props = movie.id
              ? {
                  to: `/movie/${movie.id}`,
                  className:
                    "glass flex flex-col gap-4 rounded-2xl p-4 transition hover:border-white/30",
                }
              : { className: "glass flex flex-col gap-4 rounded-2xl p-4" };

            return (
              <Card key={movie.title} {...props}>
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
                <img
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  src={movie.image}
                  alt={movie.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">{movie.title}</h4>
                <p className="text-xs text-haze">{movie.genre}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-haze">
                <span>{movie.length || "—"}</span>
                <span>{movie.year}</span>
                <span>Rating {movie.rating}</span>
              </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="glass space-y-6 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">
            Upcoming premieres
          </h3>
          <span className="text-xs text-haze">Next 30 days</span>
        </div>
        <div className="space-y-4">
          {upcoming.map((item) => (
            <div
              key={item.title}
              className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-haze">{item.note}</p>
              </div>
              <span className="text-xs text-white">{item.date}</span>
            </div>
          ))}
        </div>
        <button className="w-full rounded-full border border-white/20 px-4 py-2 text-sm text-haze">
          Set reminders
        </button>
      </div>
    </section>
  );
}
