import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-12 space-y-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">
          Suara<span className="text-primary">Kita</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Platform Deliberasi Sipil Indonesia
        </p>
      </div>

      {/* Color Palette Preview */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Color Palette
        </h2>
        <div className="grid grid-cols-5 gap-3">
          {[
            { name: "Primary", cls: "bg-primary", text: "text-primary-foreground", hex: "#DB1A1A" },
            { name: "Secondary", cls: "bg-secondary", text: "text-secondary-foreground", hex: "#8CC7C4" },
            { name: "Accent", cls: "bg-accent", text: "text-accent-foreground", hex: "#2C687B" },
            { name: "Background", cls: "bg-background border border-border", text: "text-foreground", hex: "#FFF6F6" },
            { name: "Foreground", cls: "bg-foreground", text: "text-background", hex: "#0F172A" },
          ].map((c) => (
            <div key={c.name} className={`${c.cls} ${c.text} rounded-xl p-4 space-y-1`}>
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="font-mono text-xs opacity-80">{c.hex}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Buttons
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Primary Action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      {/* Vote Buttons */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Vote Buttons
        </h2>
        <div className="flex gap-3">
          <button className="px-6 py-2 rounded-full bg-vote-agree text-white font-medium text-sm hover:opacity-90 transition-opacity">
            Setuju
          </button>
          <button className="px-6 py-2 rounded-full bg-vote-abstain text-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            Abstain
          </button>
          <button className="px-6 py-2 rounded-full bg-vote-disagree text-white font-medium text-sm hover:opacity-90 transition-opacity">
            Tidak Setuju
          </button>
        </div>
      </section>

      {/* Issue Status Pills */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Issue Status
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Diajukan", cls: "bg-status-proposed" },
            { label: "Diskusi Terbuka", cls: "bg-status-open" },
            { label: "Trending", cls: "bg-status-hot" },
            { label: "Diteruskan", cls: "bg-status-forwarded" },
            { label: "Dibahas Resmi", cls: "bg-status-legislation" },
            { label: "Menjadi Kebijakan", cls: "bg-status-enacted" },
            { label: "Ditolak", cls: "bg-status-rejected" },
          ].map((s) => (
            <span
              key={s.label}
              className={`${s.cls} text-white text-xs font-semibold px-3 py-1 rounded-full`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </section>

      {/* Tier Badges */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Tier Badges
        </h2>
        <div className="flex gap-2">
          {[
            { label: "Warga", cls: "bg-muted text-muted-foreground" },
            { label: "Pakar", cls: "bg-accent text-accent-foreground" },
            { label: "Pejabat", cls: "bg-status-enacted text-white" },
            { label: "Admin", cls: "bg-status-forwarded text-white" },
          ].map((t) => (
            <span
              key={t.label}
              className={`${t.cls} text-xs font-bold px-3 py-1 rounded-full`}
            >
              {t.label}
            </span>
          ))}
        </div>
      </section>

      {/* Sample Stance Card */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Stance Card (Preview)
        </h2>
        <div className="max-w-lg bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <p className="text-foreground font-medium leading-relaxed">
              Data biometrik harus mendapat perlindungan tingkat tertinggi karena tidak dapat diganti seperti password.
            </p>
            <span className="shrink-0 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
              PAKAR
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Dr. Sari Wijaya</span>
            <span>·</span>
            <span>Akademisi Hukum</span>
            <span>·</span>
            <span>23 menit lalu</span>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex-1 py-2 rounded-full bg-vote-agree-bg text-vote-agree font-semibold text-sm hover:bg-vote-agree hover:text-white transition-colors">
              Setuju
            </button>
            <button className="flex-1 py-2 rounded-full bg-vote-abstain-bg text-vote-abstain font-semibold text-sm hover:bg-vote-abstain hover:text-white transition-colors">
              Abstain
            </button>
            <button className="flex-1 py-2 rounded-full bg-vote-disagree-bg text-vote-disagree font-semibold text-sm hover:bg-vote-disagree hover:text-white transition-colors">
              Tidak Setuju
            </button>
          </div>
        </div>
      </section>

      {/* Cluster Colors */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Opinion Map Clusters
        </h2>
        <div className="flex gap-3">
          {["bg-cluster-0", "bg-cluster-1", "bg-cluster-2", "bg-cluster-3", "bg-cluster-4"].map(
            (cls, i) => (
              <div
                key={i}
                className={`${cls} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
