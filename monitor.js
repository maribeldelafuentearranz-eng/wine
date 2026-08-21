const state = {
  specialists: [],
  laws: [],
};

function renderList(id, items, renderItem, emptyText) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = "";
  if (items.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-state";
    li.textContent = emptyText;
    list.appendChild(li);
    return;
  }
  for (const item of items) {
    list.appendChild(renderItem(item));
  }
}

function specialistCard(s) {
  const li = document.createElement("li");
  li.className = "card";
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

function render() {
  renderList("specialists", state.specialists, specialistCard, "No specialists generated yet.");
  renderList("laws", state.laws, lawCard, "No protocols validated yet.");
}

window.NeuralMonitor = {
  addSpecialist(spec) {
    state.specialists.push(spec);
    render();
  },
  addLaw(law) {
    state.laws.push(law);
    render();
  },
  reset() {
    state.specialists = [];
    state.laws = [];
    render();
  },
};

render();
