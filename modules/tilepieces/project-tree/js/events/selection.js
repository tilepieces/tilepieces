function selection($self, e) {
  var targetElement = e.target.hasAttribute("data-path") ? e.target : e.target.closest("[data-path]");
  if (e.ctrlKey && !e.shiftKey && targetElement.classList.contains("project-tree-selected")) {
    targetElement.classList.remove("project-tree-selected");
    $self.selected.splice($self.selected.indexOf(targetElement), 1);
    //disable grab
    if (!$self.justWatch) {
      var grabber = targetElement.querySelector(".project-tree-grabber");
      grabber && grabber.classList.remove("__drag-cursor-grab");
    }
    return;
  } else if (!e.ctrlKey && !e.shiftKey) { // single selection
    $self.removeAllSelections();
  }
  $self.selected.indexOf(targetElement) == -1 && $self.selected.push(targetElement);
  // setting the toggler...
  var pos = $self.target.getBoundingClientRect().left - targetElement.getBoundingClientRect().left;
  targetElement.style.setProperty('--left',
    pos + "px");
  targetElement.style.setProperty('--left-positive',
    (-pos) + "px");
  targetElement.classList.add("project-tree-selected");
  //enable grab
  if (!$self.justWatch) {
    var grabber = targetElement.querySelector(".project-tree-grabber");
    grabber && grabber.classList.add("__drag-cursor-grab");
  }
  $self.events.dispatch("fileHighlighted", {
    path: targetElement.dataset.path,
    file: targetElement.dataset.file
  });
}