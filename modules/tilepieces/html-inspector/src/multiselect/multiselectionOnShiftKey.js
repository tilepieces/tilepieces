function multiselectionOnShiftKey(targetLI, match) {
  var multiselected = treeBuilder.multiselected;
  var lastNode = multiselected[multiselected.length - 1].listEl;
  app.multiselections.slice(0).forEach((v, i) => app.removeItemSelected());
  /*
  multiselected.forEach(v=>v.listEl.classList.remove("html-tree-builder__highlight"));
  treeBuilder.multiselected = [];
  app.multiselections.forEach(n=>n.highlight.remove());
  app.multiselections = [];
  app.elementSelected && app.core.deselectElement();*/
  treeBuilder.selected = null;
  selected = null;
  if (targetLI == lastNode)
    return;
  var arr = [lastNode, targetLI].sort((a, b) => a.offsetTop - b.offsetTop);
  var range = getElementsInRange(arr[0], arr[1]);
  var ms = [];
  range.forEach(n => {
    if (n == targetLI)
      return;
    var realNode = n["__html-tree-builder-el"];
    if (n.nodeName == "LI" && !ms.find(v => n.contains(v.listEl) || v.listEl.contains(n))
      && app.core.htmlMatch.find(realNode)) {
      app.core.selectElement(realNode);
      ms.push({listEl: n, el: realNode});
      /*
        n.classList.add("html-tree-builder__highlight");
        ms.push({listEl: n, el: realNode});
        treeBuilder.toggleClassListHighlight(n);
        app.createSelectionClone(realNode);
        */
    }
  });
  app.core.selectElement(targetLI["__html-tree-builder-el"]);
  //treeBuilder.selected = targetLI;
  //selectedIsMatch = match;
  //handleClick({detail:{selected:targetLI,multiselection:true}})
}