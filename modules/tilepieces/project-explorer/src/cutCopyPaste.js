tooltipCopy.addEventListener("click", e => {
  pt.copy();
  tooltipEl.style.display = "none";
});
tooltipCut.addEventListener("click", e => {
  pt.cut();
  tooltipEl.style.display = "none";
});
tooltipPaste.addEventListener("click", e => {
  pt.paste();
  tooltipEl.style.display = "none";
});