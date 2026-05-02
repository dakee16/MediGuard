import { MarketingNav } from "../../components/nav/marketing-nav";
import { Footer } from "../../components/home/footer";
import { Reveal } from "../../components/ui/reveal";
import { Heart, Lock, Sparkles, Users } from "lucide-react";

const VALUES = [
  {
    icon: Heart,
    label: "Care first",
    body: "Health software should feel like a friend, not a chore. Every interaction is designed to feel calm.",
  },
  {
    icon: Lock,
    label: "Privacy native",
    body: "Your data is yours. Encrypted at rest and in transit. Never sold. Never shared without your permission.",
  },
  {
    icon: Sparkles,
    label: "AI that helps",
    body: "We use AI where it earns its keep — saving you time and catching things humans miss.",
  },
  {
    icon: Users,
    label: "For everyone",
    body: "Built for caregivers, patients, and parents alike. Accessible by default. Free for the basics.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative bg-ink-50 min-h-screen">
      <MarketingNav />

      <section className="relative px-4 pt-32 md:pt-40 pb-20 overflow-hidden">
        <div className="aurora">
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Reveal>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-4">
              About MediGuard
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="font-display text-display-xl text-ink-950 text-balance leading-[0.95] mb-8">
              We&apos;re building the calmest way to take care of yourself.
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-xl text-ink-600 leading-relaxed max-w-2xl text-pretty">
              MediGuard started as a small project to help one of our parents manage a complex medication routine. Then their friends started asking. Then their friends&apos; friends. Today, thousands of people lean on MediGuard quietly in the background of their day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-coral-600 mb-4">
              What we believe
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-display-md text-ink-950 mb-12 max-w-2xl">
              Four principles, every release.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.label} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div className="glass-tint rounded-3xl p-7 h-full">
                    <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-soft mb-5">
                      <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </span>
                    <h3 className="font-display text-xl text-ink-950 mb-2">{v.label}</h3>
                    <p className="text-sm text-ink-600 leading-relaxed">{v.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="privacy" className="relative px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-teal-700 mb-4">
              Privacy
            </p>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-display text-display-md text-ink-950 mb-8 text-balance">
              Your medication data, treated with the seriousness it deserves.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <div className="space-y-5 text-ink-700 leading-relaxed text-pretty">
              <p>
                Every dose, every scan, every reminder is encrypted in transit and at rest. We use Firebase Auth and Firestore with strict access rules — only you can see your data.
              </p>
              <p>
                Image scans are processed in real time and never retained on our servers. We never sell, share, or use your medication history for advertising.
              </p>
              <p>
                For full details, see our <a href="#" className="text-teal-700 hover:text-teal-800 underline-offset-4 hover:underline">privacy policy</a>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
