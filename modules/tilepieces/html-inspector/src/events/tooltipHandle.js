function tooltipHandle(e) {
  var el = selected["__html-tree-builder-el"];
  if (!selectedIsMatch) {
    tooltipEl.style.display = "none";
    tooltipElHide = true;
    return;
  }
    /* :after,:before disable options */
  /*
  if(e.detail.pseudo){
      enableTooltipActions(["scroll-into-view"]);
  }
  */
  else {
    tooltipElHide = false;
    var nodeType = el.nodeType;
    if (nodeType == 1 && !el.nodeName.match(/(HEAD|BODY|HTML)$/)) {
      var toDisable = [];
      /* attributes tooltip edit handle */
      if (!selectedIsMatch.attributes)
        toDisable.push("edit-attribute", "add-attribute");
      else {
        attributeSelected = e.target.closest(".html-tree-builder-attribute");
        !attributeSelected && toDisable.push("edit-attribute")
      }
      if (!selectedIsMatch.HTML)
        toDisable.push("edit-inner-html", "edit-outer-html", "cut-element", "copy-element");
      if(selectedIsMatch.HTML && !selectedIsMatch.attributes)
        toDisable.push("edit-outer-html");
      var canBeAStyle = (el.tagName === "STYLE" || el.tagName === "LINK") && el.sheet && el.sheet !== app.core.currentStyleSheet;
      if(!canBeAStyle)
        toDisable.push("set-as-current-stylesheet");
      if(el.sheet !== app.core.currentStyleSheet)
        toDisable.push("save");
      var clipboard = cut || copy;
      /*
      if(!clipboard ||
          clipboard.find(n=>n.listEl.contains(selected))
      )*/
      if (!clipboard || !selectedIsMatch.match)
        toDisable.push("paste-element");
      if (clipboard && clipboard.length > 1)
        tooltipEl.classList.add("multiselected");
      else
        tooltipEl.classList.remove("multiselected");
      enableTooltipActions(toDisable, true);
    }
    else if (nodeType == 3 || nodeType == 8) {
      enableTooltipActions(["delete-element", "cut-element", "copy-element", "scroll-into-view"]);
    } else if (el.nodeName.match(/(HEAD|BODY|HTML)$/)) {
      var toDisable = ["cut-element", "copy-element", "edit-outer-html", "delete-element","set-as-current-stylesheet","save"];
      if (!selectedIsMatch.HTML) {
        toDisable.push("edit-inner-html")
      }
      enableTooltipActions(toDisable, true);
    } else enableTooltipActions([]);
  }
}