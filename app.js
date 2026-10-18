/* Kanban Board — drag-and-drop task board with localStorage persistence.
 *
 * How it works:
 *   1. Board state lives in `state` (column name -> array of {id, text}).
 *   2. Every change calls saveState() -> localStorage, then render().
 *   3. Cards are draggable; dropping a card moves it between columns.
 */

"use strict";

const STORAGE_KEY = "kanban-day23";
const COLUMNS = ["todo", "doing", "done"];

// Demo cards shown on the very first visit so the board isn't empty.
const DEMO_STATE = {
  todo: [
    { id: "d1", text: "Plan this week's coding projects 💻" },
    { id: "d2", text: "Read one chapter of a JS book" },
  ],
  doing: [
    { id: "d3", text: "Build a kanban board" },
  ],
  done: [
    { id: "d4", text: "Ship Day 22 projects 🚀" },
  ],
};

let state = loadState();

// The card currently being dragged (set on dragstart, read on drop).
let draggedCardId = null;
let draggedFromColumn = null;

// --- Persistence -----------------------------------------------------------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Guard against corrupted saves: keep only known columns of cards.
      const clean = { todo: [], doing: [], done: [] };
      for (const col of COLUMNS) {
        if (Array.isArray(parsed[col])) {
          clean[col] = parsed[col].filter(
            (c) => c && typeof c.id === "string" && typeof c.text === "string"
          );
        }
      }
      return clean;
    }
  } catch (e) {
    console.warn("Could not load saved board, using demo data.", e);
  }
  // Deep-copy the demo so edits never mutate the constant.
  return JSON.parse(JSON.stringify(DEMO_STATE));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --- Rendering -------------------------------------------------------------
function render() {
  for (const col of COLUMNS) {
    const list = document.getElementById(`list-${col}`);
    list.innerHTML = "";

    if (state[col].length === 0) {
      const note = document.createElement("div");
      note.className = "empty-note";
      note.textContent = "Drop cards here";
      list.appendChild(note);
    }

    for (const card of state[col]) {
      list.appendChild(buildCardElement(card, col));
    }

    document.getElementById(`count-${col}`).textContent = state[col].length;
  }
}

function buildCardElement(card, column) {
  const el = document.createElement("div");
  el.className = "card";
  el.draggable = true;
  el.dataset.cardId = card.id;
  el.dataset.column = column;

  const text = document.createElement("span");
  text.textContent = card.text; // textContent (not innerHTML) blocks HTML injection
  el.appendChild(text);

  const del = document.createElement("button");
  del.className = "delete-btn";
  del.textContent = "×";
  del.title = "Delete card";
  del.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteCard(column, card.id);
  });
  el.appendChild(del);

  // Double-click a card to rename it.
  el.addEventListener("dblclick", () => {
    const updated = prompt("Edit card:", card.text);
    if (updated !== null && updated.trim() !== "") {
      card.text = updated.trim();
      saveState();
      render();
    }
  });

  el.addEventListener("dragstart", () => {
    draggedCardId = card.id;
    draggedFromColumn = column;
    // Small delay so the browser snapshots the card before we fade it.
    setTimeout(() => el.classList.add("dragging"), 0);
  });

  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
    draggedCardId = null;
    draggedFromColumn = null;
    document
      .querySelectorAll(".card-list")
      .forEach((l) => l.classList.remove("drag-over"));
  });

  return el;
}

// --- Mutations ---------------------------------------------------------------
function addCard(column, text) {
  state[column].push({ id: "c" + Date.now().toString(36), text });
  saveState();
  render();
}

function deleteCard(column, cardId) {
  state[column] = state[column].filter((c) => c.id !== cardId);
  saveState();
  render();
}

function moveCard(cardId, fromColumn, toColumn) {
  const index = state[fromColumn].findIndex((c) => c.id === cardId);
  if (index === -1) return;
  const [card] = state[fromColumn].splice(index, 1);
  state[toColumn].push(card);
  saveState();
  render();
}

// --- Drag-and-drop wiring ----------------------------------------------------
for (const col of COLUMNS) {
  const list = document.getElementById(`list-${col}`);

  // dragover must be cancelled or the drop event never fires.
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    list.classList.add("drag-over");
  });

  list.addEventListener("dragleave", () => {
    list.classList.remove("drag-over");
  });

  list.addEventListener("drop", (e) => {
    e.preventDefault();
    list.classList.remove("drag-over");
    if (draggedCardId && draggedFromColumn) {
      moveCard(draggedCardId, draggedFromColumn, col);
    }
  });
}

// --- Add-card forms ------------------------------------------------------------
document.querySelectorAll(".add-form").forEach((form) => {
  const column = form.dataset.form;
  const input = form.querySelector("input");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stay on the page instead of reloading
    const text = input.value.trim();
    if (text === "") return;
    addCard(column, text);
    input.value = "";
    input.focus();
  });
});

// --- Reset button --------------------------------------------------------------
document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Reset the board to the demo cards?")) {
    state = JSON.parse(JSON.stringify(DEMO_STATE));
    saveState();
    render();
  }
});

// First paint.
render();
