import Link from 'next/link';
import { Bubbles } from '@/components/landing/Bubbles';
import { MatrixPreview } from '@/components/landing/MatrixPreview';
import { Reveal } from '@/components/landing/Reveal';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  FeatherIcon,
  LockIcon,
  OtterMark,
  TargetIcon,
} from '@/components/ui/Icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const BENEFITS = [
  {
    icon: FeatherIcon,
    title: 'Nothing to sign up for',
    body: 'No account, no email, no onboarding tour. Open it and start typing — that is the whole setup.',
  },
  {
    icon: TargetIcon,
    title: 'Two views, one list',
    body: 'A flat list for getting things out of your head, and a matrix for deciding what they are worth. Same tasks, different lens.',
  },
  {
    icon: LockIcon,
    title: 'Stays on your device',
    body: 'Tasks are saved in your browser. Nothing is uploaded, nothing is tracked, and there is no server holding your list hostage.',
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 sm:px-8">
      {/* ---------------------------------------------------------------- Nav */}
      <header className="flex items-center justify-between py-6">
        <span className="flex items-center gap-2.5">
          <OtterMark size={34} className="text-primary" />
          <span className="font-display text-2xl font-semibold tracking-tight">otter</span>
        </span>

        <nav className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/todos"
            className="btn btn-ghost px-4 py-2 text-sm"
            style={{ minHeight: 44 }}
          >
            Open app
          </Link>
        </nav>
      </header>

      {/* -------------------------------------------------------------- Hero */}
      <section className="relative flex flex-col items-center overflow-hidden pb-20 pt-10 text-center sm:pt-16">
        <Bubbles />

        <div className="relative">
          <Reveal>
            <OtterMark size={92} className="float-bob mx-auto text-primary" />
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mx-auto mt-8 max-w-[16ch] font-display text-[2.6rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              Not everything urgent is <em className="not-italic text-primary">important</em>.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-muted">
              Otter is a small, quiet todo app. Capture what is on your mind, then sort it across a
              four-square grid that separates the loud from the meaningful.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/todos" className="btn btn-primary w-full px-7 text-base sm:w-auto" style={{ minHeight: 52 }}>
                Start using Otter
                <ArrowRightIcon size={18} />
              </Link>
              <a href="#how" className="btn btn-ghost w-full px-6 text-base sm:w-auto" style={{ minHeight: 52 }}>
                See how it works
                <ArrowDownIcon size={17} />
              </a>
            </div>
            <p className="mt-4 text-sm text-faint">Free, and it opens straight into an empty list.</p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- Benefits */}
      <section className="grid gap-4 pb-24 sm:grid-cols-3">
        {BENEFITS.map((benefit, i) => (
          <Reveal key={benefit.title} delay={i * 90}>
            <div className="card h-full p-6">
              <span className="inline-flex rounded-xl p-2.5 text-primary" style={{ background: 'var(--surface-sunk)' }}>
                <benefit.icon size={22} />
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{benefit.body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ------------------------------------------------------------- Matrix */}
      <section id="how" className="scroll-mt-8 pb-24">
        <Reveal>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            The idea
          </p>
          <h2 className="mx-auto mt-3 max-w-[20ch] text-center font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Four squares, one honest question
          </h2>
          <p className="mx-auto mt-4 max-w-[56ch] text-center leading-relaxed text-muted">
            Every task gets asked two things: does this actually matter, and does it actually need to
            happen now? Where those answers cross is the Eisenhower matrix — and it is remarkably good
            at exposing busywork.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="card mt-10 p-4 sm:p-6">
            <MatrixPreview />
          </div>
        </Reveal>

        <Reveal delay={180}>
          <p className="mx-auto mt-6 max-w-[58ch] text-center text-sm leading-relaxed text-muted">
            Most of us live in <strong className="font-semibold text-ink">A</strong> and{' '}
            <strong className="font-semibold text-ink">C</strong> — reacting all day and calling it
            progress. The point of the grid is to defend{' '}
            <strong className="font-semibold" style={{ color: 'var(--q-b-ink)' }}>B</strong>, where the
            work you will be glad you did actually lives.
          </p>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ Privacy */}
      <section className="pb-24">
        <Reveal>
          <div className="card flex flex-col items-center gap-5 p-8 text-center sm:p-12">
            <span className="inline-flex rounded-2xl p-3 text-primary" style={{ background: 'var(--surface-sunk)' }}>
              <LockIcon size={26} />
            </span>
            <h2 className="max-w-[22ch] font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Your list never leaves your browser
            </h2>
            <p className="max-w-[54ch] leading-relaxed text-muted">
              Otter has no backend and no analytics. Everything you write is stored locally on this
              device, which also means your tasks will not follow you to another browser or phone —
              a deliberate trade for keeping the app this simple.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ----------------------------------------------------------- Last CTA */}
      <section className="pb-24">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <OtterMark size={52} className="text-primary" />
            <h2 className="mt-6 max-w-[18ch] font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Ready to sort the noise?
            </h2>
            <Link
              href="/todos"
              className="btn btn-primary mt-8 px-8 text-base"
              style={{ minHeight: 52 }}
            >
              Start using Otter
              <ArrowRightIcon size={18} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------- Footer */}
      <footer className="flex flex-col items-center gap-2 border-t py-8 text-center text-sm text-faint">
        <span className="flex items-center gap-2">
          <OtterMark size={20} className="text-faint" />
          <span className="font-display text-base">otter</span>
        </span>
        <p>A small tool for deciding what matters.</p>
      </footer>
    </main>
  );
}
