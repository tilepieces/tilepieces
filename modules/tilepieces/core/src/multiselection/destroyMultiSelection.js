tilepieces.destroyMultiselection = function (noemit) {
  tilepieces.multiselected = null;
  tilepieces.multiselections.forEach((v, i) => {
    var el = tilepieces.multiselections[i];
    if (el.el == tilepieces.elementSelected)
        return;
    var highlight = el.highlight;
    highlight.remove();
    !noemit && window.dispatchEvent(new CustomEvent("deselect-multielement", {detail: el.el}));
  });
  tilepieces.multiselections = [];
  !noemit && window.dispatchEvent(new Event("multiselection-canceled"))
}