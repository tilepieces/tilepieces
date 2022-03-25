function changeSelection(index) {
  searchBarEntries.children[0].textContent = index + 1;
  var value = selections[index];
  if (value == currentSearchEl)
    return;
  currentSearchEl = value;
  app.core.selectElement(currentSearchEl);
  //currentSearchEl.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));
  /*
  if(currentSearchEl.nodeType == 1)
      treeBuilder.highlightElement(currentSearchEl);
  else
      treeBuilder.highlightElement(currentSearchEl.parentNode);
      */
}

searchBarUp.addEventListener("click", function (e) {
  if (e.target.disabled)
    return;
  pointer = pointer ? pointer - 1 : selections.length - 1;
  changeSelection(pointer)
});
searchBarDown.addEventListener("click", function (e) {
  if (e.target.disabled)
    return;
  pointer = pointer < selections.length - 1 ? pointer + 1 : 0;
  changeSelection(pointer)
});
searchBar.addEventListener("click", function (e) {
  if (e.target.nodeName != "BUTTON" ||
    e.target.parentNode != searchBar ||
    e.target == searchSelected)
    return;
  searchSelected.classList.remove("selected");
  e.target.classList.add("selected");
  searchSelected = e.target;
});
findButton.addEventListener("input", (e)=>{
  selectionText = findButton.value.trim();
  currentSearchEl = null;
  var doc = app.core.currentDocument;
  try {
    selections = doc.querySelectorAll(selectionText);
  }
  catch(e){
    selections = [];
  }
  searchBarEntries.children[0].textContent = selections.length ? "1" : "0";
  searchBarEntries.children[1].textContent = selections.length ? selections.length : "0";
  searchBarEntries.style.display = "block";
  searchBarDown.disabled = !selections.length;
  searchBarUp.disabled = !selections.length;
  selections.length && changeSelection(0);
})