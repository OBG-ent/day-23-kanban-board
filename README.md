# Kanban Board 📋

**Your tasks, three columns, zero setup — drag a card, watch it move, close the tab, it's still there.**

A clean drag-and-drop kanban board (To Do → In Progress → Done) that saves everything to your browser automatically. No account, no backend, no build step — just open the page and organize your day.

## ✨ Features

- 🖱️ **Drag & drop** cards between columns (real HTML5 drag-and-drop)
- 💾 **Auto-save** — every change persists in `localStorage`; refresh-safe
- ➕ Add cards from any column's quick-add box
- ✏️ Double-click any card to edit its text
- 🗑️ One-click card delete
- 🔢 Live card counters on every column
- ↺ Reset button to restore the demo board
- 📱 Responsive — columns stack on mobile
- 🎨 Dark minimal theme with a gold accent

## 🚀 Run it in 30 seconds

No build tools, no server needed:

1. Download or clone this repo
2. Double-click **`index.html`** — that's it

Or serve it locally:

```bash
npx serve .
# then open the URL it prints
```

**Try this:** drag the "Build a kanban board" card into **Done** — satisfying, right? Then double-click any card to rename it, refresh the page, and notice nothing was lost.

## 🧠 What I practiced

- HTML5 drag-and-drop API (`dragstart`, `dragover`, `drop`)
- `localStorage` persistence with JSON serialize/deserialize (plus corrupted-save guards)
- Rendering UI from a state object — one `render()` repaints the whole board
- Event delegation patterns and `dataset` attributes
- Responsive CSS grid + a mobile breakpoint

## 🗂️ Files

| File | What it does |
|------|--------------|
| `index.html` | Page structure: header, 3 columns, add-card forms |
| `style.css` | Dark theme, cards, columns, drag highlight, mobile layout |
| `app.js` | State, rendering, drag-and-drop, persistence, editing |

---

*Day 23 · featured build of my daily coding journey — ship two projects a day. 💻*
