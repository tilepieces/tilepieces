async function openRecursively(path,dblClick) {
  var isPresentPath = path[0] == "/" ? path.substring(1) : path;
  var isPresent = pt.target.querySelector(`[data-path="${isPresentPath}"]`);
  if (isPresent && isPresent.classList.contains("project-tree-selected")) {
    var rect = isPresent.getBoundingClientRect();
    var isVisible = (rect.top >= 0) && (rect.bottom <= window.innerHeight)
    !isVisible &&
    isPresent.scrollIntoView();
    return;
  }
  if (path[0] != "/") path = "/" + path;
  var pathSplitted = path.split("/");
  var partialPath = "";
  for (var i = 0; i < pathSplitted.length; i++) {
    var partOfPath = pathSplitted[i];
    if (partOfPath && partialPath)
      partialPath += "/" + partOfPath;
    else if (partOfPath && !partialPath)
      partialPath = partOfPath;
    var target = pt.target.querySelector(`[data-path${partialPath ? `="${partialPath}"` : ""}]`);
    if (!target)
      return;
    if (i != pathSplitted.length - 1) {
      target.querySelector(".selector").classList.add("project-tree-caret__open");
      try {
        await ptOpenTree({
          path: target.dataset.path,
          DOMel: target
        })
      } catch (e) {
        console.error("[error in opening directory]", e);
        alertDialog("Error in opening directory " + partialPath);
      }
    } else {
      target.scrollIntoView();
      if(dblClick)
        target.dispatchEvent(new MouseEvent("dblclick",{bubbles:true}));
      else
        target.click()
    }
  }
}