"use strict";

const form = document.querySelector(".publication-filters");
const query = document.querySelector("#publication-search");
const year = document.querySelector("#publication-year");
const kind = document.querySelector("#publication-kind");
const papers = [...document.querySelectorAll(".publication")];
const groups = [...document.querySelectorAll(".publication-year")];
const results = document.querySelector("#publication-results");
const normalize = value => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const searchable = new Map(papers.map(paper => [paper, normalize(paper.dataset.search)]));

function applyFilters() {
  const terms = normalize(query.value).trim().split(/\s+/).filter(Boolean);
  let count = 0;
  for (const paper of papers) {
    paper.hidden = !(
      (!year.value || paper.dataset.year === year.value) &&
      (!kind.value || paper.dataset.kind === kind.value) &&
      terms.every(term => searchable.get(paper).includes(term))
    );
    if (!paper.hidden) count += 1;
  }
  for (const group of groups) {
    const visible = [...group.querySelectorAll(".publication")].filter(paper => !paper.hidden).length;
    group.hidden = visible === 0;
    group.querySelector("h2 span").textContent = visible + (visible === 1 ? " copy" : " copies");
  }
  results.textContent = count === papers.length
    ? "Showing all " + papers.length + " PDFs"
    : "Showing " + count + " of " + papers.length + " PDFs";
  document.querySelector("#no-publications").hidden = count !== 0;
}

form.hidden = false;
form.addEventListener("submit", event => event.preventDefault());
form.addEventListener("input", applyFilters);
form.addEventListener("change", applyFilters);
form.addEventListener("reset", () => {
  query.value = "";
  year.value = "";
  kind.value = "";
  applyFilters();
});

const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector("#site-navigation");
function closeMenu() {
  links.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
links.addEventListener("click", event => { if (event.target.closest("a")) closeMenu(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && links.classList.contains("open")) {
    closeMenu();
    toggle.focus();
  }
});
