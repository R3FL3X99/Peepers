export default function ExperienceSection() {
  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="glass rounded-3xl p-6">
        <h3 className="font-display text-xl font-semibold">
          Personal cinema room
        </h3>
        <p className="mt-2 text-sm text-haze">
          Build a watchlist, invite friends, and sync playback with live
          reactions.
        </p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
            <div>
              <p className="text-sm font-semibold">Room themes</p>
              <p className="text-xs text-haze">12 cinematic presets</p>
            </div>
            <span className="text-xs text-aurora">Active</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
            <div>
              <p className="text-sm font-semibold">Live chat</p>
              <p className="text-xs text-haze">Reactions and polls</p>
            </div>
            <span className="text-xs text-aurora">Beta</span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
            <div>
              <p className="text-sm font-semibold">Smart queue</p>
              <p className="text-xs text-haze">Auto-rotates moods</p>
            </div>
            <span className="text-xs text-aurora">New</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8">
        <div className="hero-stripe absolute inset-0 opacity-30"></div>
        <div className="relative z-10 space-y-6">
          <h3 className="font-display text-3xl font-semibold">
            Stay in the loop.
          </h3>
          <p className="max-w-md text-sm text-haze">
            Weekly drops of premiere alerts, director interviews, and
            behind-the-scenes reels.
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-haze focus:outline-none"
              placeholder="Email address"
            />
            <button className="rounded-full bg-aurora px-6 py-3 text-sm font-semibold text-midnight">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-haze">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
