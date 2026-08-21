const CORE_LABELS = {
  synchronized: "Core Synchronized",
  degraded: "Core Degraded",
  offline: "Core Offline",
};

const STATUS_ALIASES = {
  ok: "ok", active: "ok", running: "ok", online: "ok",
  warn: "warn", idle: "warn", degraded: "warn", pending: "warn",
  err: "err", error: "err", offline: "err", failed: "err",
};

function normalizeStatus(s) {
  return STATUS_ALIASES[String(s || "").toLowerCase()] || "warn";
}

const state = {
  core: "synchronized",
  specialists: new Map(),
  laws: new Map(),
};

let idCounter = 0;
function makeId(prefix) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function renderList(id, items, renderItem, emptyText) {
  const list = document.getElementById(id);
  if (!list) return;
  list.replaceChildren();
  if (items.size === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = emptyText;
    list.appendChild(li);
    return;
  }
  const frag = document.createDocumentFragment();
  for (const item of items.values()) frag.appendChild(renderItem(item));
  list.appendChild(frag);
}

function specialistCard(s) {
  const li = document.createElement("li");
  li.className = "card";
  li.dataset.status = normalizeStatus(s.status);
  const h = document.createElement("h3");
  h.className = "card__title";
  h.textContent = s.name;
  const meta = document.createElement("div");
  meta.className = "card__meta";
  meta.textContent = `${s.role} · ${s.status}`;
  li.append(h, meta);
  return li;
}

function lawCard(l) {
  const li = document.createElement("li");
  li.className = "card";
  const h = document.createElement("h3");
  h.className = "card__title";
  h.textContent = l.title;
  const meta = document.createElement("div");
  meta.className = "card__meta";
  meta.textContent = l.description;
  li.append(h, meta);
  return li;
}

function renderCore() {
  const el = document.querySelector(".core-status");
  if (!el) return;
  el.dataset.state = state.core;
  const label = el.querySelector(".core-status__label");
  if (label) label.textContent = CORE_LABELS[state.core] || state.core;
}

function render() {
  renderCore();
  renderList("specialists", state.specialists, specialistCard, "No specialists generated yet.");
  renderList("laws", state.laws, lawCard, "No protocols validated yet.");
}

window.NeuralMonitor = {
  setCore(coreState) {
    if (!CORE_LABELS[coreState]) return false;
    state.core = coreState;
    render();
    return true;
  },
  addSpecialist(spec) {
    if (!spec || !spec.name) return null;
    const id = spec.id || makeId("specialist");
    state.specialists.set(id, {
      id,
      name: String(spec.name),
      role: String(spec.role || "Unknown"),
      status: String(spec.status || "idle"),
    });
    render();
    return id;
  },
  updateSpecialist(id, patch) {
    const cur = state.specialists.get(id);
    if (!cur) return false;
    state.specialists.set(id, { ...cur, ...patch, id });
    render();
    return true;
  },
  removeSpecialist(id) {
    const ok = state.specialists.delete(id);
    if (ok) render();
    return ok;
  },
  addLaw(law) {
    if (!law || !law.title) return null;
    const id = law.id || makeId("law");
    state.laws.set(id, {
      id,
      title: String(law.title),
      description: String(law.description || ""),
    });
    render();
    return id;
  },
  updateLaw(id, patch) {
    const cur = state.laws.get(id);
    if (!cur) return false;
    state.laws.set(id, { ...cur, ...patch, id });
    render();
    return true;
  },
  removeLaw(id) {
    const ok = state.laws.delete(id);
    if (ok) render();
    return ok;
  },
  reset() {
    state.core = "synchronized";
    state.specialists.clear();
    state.laws.clear();
    render();
  },
};

document.addEventListener("DOMContentLoaded", render);
