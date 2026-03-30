# Otter

A todo app, but also a learning project; a place to make real decisions, understand why they work, and document them honestly.

> I suck at frontend. This is my effort to get somewhat decent at it.

---

## What it is

A single-page task manager built on **vanilla HTML, CSS, and JavaScript**, no framework, no build step, no dependencies beyond a CDN font and icon pack. You open `index.html` in a browser and it works.

It currently has:
- A **todo list** with add, edit, delete, and checkbox completion
- An **Eisenhower Matrix** view, four quadrants (Important/Urgent, Important/Not Urgent, Urgent/Not Important, Neither) to prioritize tasks
- **Drag-and-drop** between quadrants
- **Priority badges** on todo items showing which quadrant a task belongs to
- **Filter by quadrant** in the todo list view
- **Dark mode** toggle with preference saved to `localStorage`
- **Confetti** when all tasks are completed (obviously essential)

---

## Architecture

### Why no framework?

The deliberate constraint here is zero build tooling. No React, no Vue, no Vite, no npm. Everything runs as static files. The reasons:

1. **Forces fundamentals.** Working without abstractions makes DOM manipulation, event delegation, and state management visible. You can't hide behind `useState` when there's no React.
2. **Fast feedback loop.** Save a file, refresh. No compilation, no HMR, no terminal to watch.
3. **Honest complexity.** At this scale, a framework would be overkill. The app is three files. Adding a build chain would mean more tooling than product.

This will change as the app grows. A proper frontend framework will make sense once the component count justifies it.

### State management

There's no state library. All app state lives in a single `tasks` array in memory (declared in `script.js`). Every mutation:
1. Updates the array
2. Calls `saveTasks()`, serializes to `localStorage`
3. Re-renders the affected view

`localStorage` (key: `myTasks`) is the source of truth across page loads. On boot, `loadTasks()` deserializes it back into the array and renders.

This is simple and sufficient right now. As data complexity grows, user accounts, server sync, optimistic updates, this will need to be replaced with something more structured.

### Theme system

Dark mode is implemented via a `body.dark` CSS class swap rather than CSS custom properties or a separate stylesheet. The tradeoff:

- **Simpler to implement:** one class toggle, two overridden properties (`background-color`, `background-image`)
- **Less scalable:** if the number of themed properties grows, custom properties (`--color-bg`, etc.) would be the right refactor

The background is a topography SVG pattern from [heropatterns.com](https://heropatterns.com) (MIT licensed), inlined as a `data:` URI; no external image request, no licensing risk. This replaced an original background photo that had unclear licensing.

User's theme preference is persisted to `localStorage` under the key `theme`.

### Eisenhower Matrix

The quadrant system stores a `quadrant` field (`'A' | 'B' | 'C' | 'D' | null`) on each task object. Tasks without a quadrant appear only in the todo list. Tasks with one appear in both views.

The modal for assigning tasks to quadrants surfaces only unassigned tasks; once a task is in a quadrant, it must be explicitly removed (via the ✕ button) before it can be reassigned. This was a deliberate UX choice to avoid accidental re-categorization.

---

## Running it

```bash
# Option 1: just open the file
open index.html

# Option 2: serve it locally
python3 -m http.server 8080
# then visit http://localhost:8080
```

No install step. No build step.

---

## What comes next

This is version 0 of something that will grow. Planned evolution:

- **Proper frontend:** likely a component-based framework once the UI complexity justifies it
- **Backend + persistence:** tasks living in a database, not just `localStorage`
- **User accounts:** so the app is actually useful across devices
- **API layer:** REST or GraphQL, TBD based on what makes sense at the time

Each of these shifts will be documented here with the reasoning behind the choices made.
