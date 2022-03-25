function tooltipKeyEvents(e) {
  var sel = tooltipEl.querySelector(".selected");
  if (e.key == "ArrowUp" || e.key == "ArrowDown") {
    var multiselection = treeBuilder.multiselection;
    var root = multiselection ? multiselectionToolTip : tooltipEl;
    if (!sel)
      root.children[0].classList.add("selected");
    else {
      sel.classList.remove("selected");
      var next;
      if (e.key == "ArrowUp") {
        var previous = sel.previousElementSibling;
        while (previous && (previous.tagName != "DIV" || previous.hasAttribute("disabled")))
          previous = previous.previousElementSibling;
        next = previous || (
          multiselection ?
            multiselectionToolTip.children[multiselectionToolTip.children.length - 1] :
            tooltipEl.children[tooltipEl.children.length - 2]
        )
      } else {
        var nextS = sel.nextElementSibling;
        while (nextS && (nextS.tagName != "DIV" || nextS.hasAttribute("disabled")))
          nextS = nextS.nextElementSibling;
        next = nextS || root.children[0]
      }
      next.classList.add("selected");
    }
  }
  if (e.key == "Enter" && sel) {
    e.preventDefault();
    sel.click();
  }
}