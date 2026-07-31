# Otter

A todo app, but also a learning project; a place to make real decisions, understand why they work, and document them honestly.

> I suck at frontend. This is my effort to get somewhat decent at it.

---

## What it is

A task manager built with **Next.js, TypeScript, and Tailwind**, running entirely in the browser. There is no account to create and no server to talk to. Your tasks are saved in `localStorage` on the device you are using.

It currently has:
- A **landing page** explaining the app and the Eisenhower idea, with a single call to action
- A **todo list** with add, edit, delete, checkbox completion, and a progress bar
- An **Eisenhower Matrix** view, four quadrants (Important/Urgent, Important/Not Urgent, Urgent/Not Important, Neither) to prioritize tasks
- **Drag-and-drop** between quadrants, with a keyboard alternative for anyone not using a mouse
- **Priority badges** on todo items showing which quadrant a task belongs to
- **Filter by quadrant** in the todo list view, with live counts
- **Dark mode**, following your system preference until you choose otherwise
- **Bubbles** when all tasks are completed (obviously essential)

---

## Architecture

### Why a framework now

The first version of this app was three static files with no build step, and that was the right call at the time. It stopped being the right call once there were two views sharing state, a drag-and-drop surface, and a component that needed to exist in both places. The vanilla version was re-rendering entire lists by hand and passing array indices around as identity, which broke as soon as filtering entered the picture.

So the stack is now Next.js with TypeScript, Tailwind v4 for styling, TanStack Query for state, and dnd-kit for dragging. The original `index.html`, `script.js`, and `style.css` are still in the repo as a reference. They are no longer the running app.

### Why localStorage, and why the backend was deleted

The previous version of this README listed "backend + persistence" and "user accounts" as the plan. I built both: FastAPI, SQLAlchemy, Alembic migrations, Postgres on Aiven, JWT auth with refresh tokens. It worked.

Then I deleted it.

The honest reasoning: I was about to start paying for a database and a domain for an app with one confirmed user, which is me. The managed Postgres instance had already been torn down for inactivity by the time I came back to it, which was a fairly loud hint. Multi-device sync is a real feature, but it is a feature worth building when people are actually asking for it, not before.

So tasks live in `localStorage` under the key `myTasks`, the same key the vanilla version used. `lib/hooks.ts` is the only place that touches storage, and it migrates older entries that are missing `id`, `position`, or timestamps, so data written by the original prototype still loads today.

The tradeoff is stated plainly on the landing page rather than hidden: your tasks stay on this device, and they will not follow you to your phone. If that stops being acceptable, the backend is in the git history (removed in `c5bc20b`) and is a reasonable starting point.

### Design system

Styling used to be inline style objects scattered across components, which meant every color was a magic number and dark mode was a guess. There is now a small design system at the top of `frontend/app/globals.css`, built on CSS custom properties and exposed to Tailwind through `@theme inline`, so utilities like `bg-surface` and `text-muted` resolve to real tokens.

The visual direction is "still water": a calm teal base, with warm amber reserved exclusively for primary actions so there is never a question about what the main button on a screen is. The background is a pair of slowly drifting gradients over a tiled SVG contour pattern.

Two things this cleaned up:

1. **CSS weight.** `globals.css` was 184KB, because two background images had been base64 inlined directly into render blocking CSS. It is now roughly 12KB, and the background pattern is an inline SVG of about 350 bytes.
2. **Icons.** Emoji were doing structural work in the UI (a 🦦 for empty states, a ✕ for dismiss). Emoji render differently on every platform and cannot be styled, so they are now a proper SVG icon set with a consistent stroke width, including a hand-built otter mark.

Type is Fraunces for headings and Inter for interface text. The previous font, Comfortaa, is a display face, and it was being asked to render 11px body copy in the task list, which it is not built for.

### Accessibility

This is the part I previously would have skipped, so it is worth writing down. The app now checks out on all of the following, verified in a real browser rather than by eye:

- Text meets WCAG AA contrast in **both** light and dark themes. This needed measuring rather than guessing, because almost every surface is translucent, so the contrast that matters is the composited result, not the color written in the stylesheet.
- Every control has an accessible name, and touch targets are at least 44px even where the icon is smaller.
- `prefers-reduced-motion` is respected everywhere, including the ambient background.
- Scroll revealed content has a `<noscript>` fallback, since otherwise the entire page below the fold would be invisible with JavaScript disabled.
- Matrix tasks can be moved with the keyboard, not only by dragging.

### Theme system

Dark mode is a `.dark` class on `<html>`, driven by CSS custom properties rather than the property by property overrides the vanilla version used. A small script runs before hydration to prevent a flash of the wrong theme.

The behavior is: an explicit choice saved in `localStorage` under `theme` always wins; otherwise the app follows your operating system preference.

### Eisenhower Matrix

Each task stores a `quadrant` field (`'A' | 'B' | 'C' | 'D' | null`). Tasks without a quadrant appear only in the todo list. Tasks with one appear in both views.

The four quadrant colors are fixed identity colors and do not change. They are dark by design, which makes them illegible against a dark background, so each one has a derived `ink` variant for text and a `tint` variant for fills and borders. Those derived values differ between themes; the base hues never do.

The matrix view labels its own axes (urgent across, important down) because a 2x2 grid of colored boxes does not explain itself, and the whole point of the tool is the question it forces you to answer.

---

## Running it

```bash
cd frontend
npm install
npm run build && npm run start
# then visit http://localhost:3000
```

`npm run dev` works too, but the dev server is noticeably memory hungry, so a production build is the better default for just using the app.

---

## What comes next

Deliberately open. The next thing gets built when there is evidence it is needed, not because it was on a roadmap written months earlier. Candidates:

- **Sync**, if and when more than one person is using this on more than one device
- **Task ordering** within a quadrant, which drag-and-drop already implies but does not yet persist
- **Recurring tasks**, which is the first feature I have actually wanted while using it

Each of these shifts will be documented here with the reasoning behind the choices made, including the ones that turn out to be wrong.
