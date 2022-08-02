tilepieces.createSelectionClone = function (el) {
  if (tilepieces.multiselections.find(v => v.el == el))
    return;
  var highlight = tilepieces.editElements.selection.cloneNode(true);
  highlight.classList.add("highlight-selection-clone");
  highlight.style.opacity = "0.45";
  highlight.style.transform = "translate(-9999px,-9999px)";
  document.body.appendChild(highlight);
  tilepieces.multiselections.push({el, highlight});
};