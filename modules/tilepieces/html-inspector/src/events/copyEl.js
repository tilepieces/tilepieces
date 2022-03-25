function copyEl(elementsToCopy) {
  var clipboard = copy || cut;
  clipboard && clipboard.forEach(n => n.listEl.classList.remove("cutted", "copied"));
  copy = elementsToCopy ||
    (treeBuilder.multiselection ? treeBuilder.multiselected.slice(0) : [{
      el: selected["__html-tree-builder-el"],
      listEl: selected
    }]);
  copy.forEach(n => n.listEl.classList.add("copied"));
  cut = null;
  // clear multiselection
  //treeBuilder.clearMultiSelection();
  // elementsToCopy means a call from css/js view. We disable multiselection in this case.
  /*
    if(treeBuilder.multiselection) {
        multiselectButton.click();
        //app.core.deselectElement();
    }
    */
}