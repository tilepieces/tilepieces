buttonRefactorFile.addEventListener("click", e => {
  if (pt && pt.selected[0]) {
    pt.refactor(pt, pt.selected[0]);
    tooltipEl.style.display = "none";
  }
});