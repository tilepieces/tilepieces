function cutEl(elementsToCut) {
  var clipboard = copy || cut;
  clipboard && clipboard.forEach(n => n.listEl.classList.remove("cutted", "copied"));
  cut = elementsToCut ||
    (treeBuilder.multiselection ? treeBuilder.multiselected.slice(0) : [{
      el: selected["__html-tree-builder-el"],
      listEl: selected
    }]);
  cut.forEach(n => n.listEl.classList.add("cutted"));
  copy = null;
  // clear multiselection
  //treeBuilder.clearMultiSelection(); // problem with selected
  // elementsToCopy means a call from css/js view. We disable multiselection in this case.
    if(treeBuilder.multiselection) {
        multiselectButton.click();
        //app.core.deselectElement();
    }
}