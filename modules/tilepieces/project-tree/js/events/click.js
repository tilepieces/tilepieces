function click($self, e) {
  e.preventDefault();
  if (e.target.classList.contains("tooltip-toggler")) { // open/close tooltip
    $self.events.dispatch("open-tooltip", {
      path: e.target.parentNode.parentNode.dataset.path,
      DOMel: e.target.parentNode.parentNode,
      file: e.target.parentNode.parentNode.dataset.file,
      e
    })
  } else if (e.target.classList.contains("project-tree-caret")) { // open/close tree
    var isOpen = e.target.parentNode.classList.toggle("project-tree-caret__open");
    if (isOpen)
      $self.events.dispatch("openTree", {
        path: e.target.parentNode.parentNode.dataset.path,
        DOMel: e.target.parentNode.parentNode
      })
  } else if (!e.ctrlKey && !e.shiftKey) selection($self, e)
}
