function read($self, e) {
  e.preventDefault();
  var targetElement = e.target.nodeName != "LI" ? e.target.closest("li") : e.target;
  if (!targetElement) {
    console.error(e);
    return;
  }
  if (targetElement.classList.contains("project-tree-file"))
    $self.events.dispatch("fileSelected", {
      path: targetElement.dataset.path,
      file: targetElement.dataset.file
    });
  /*
  if(e.target.classList.contains("project-tree-directory-name") ||
      e.target.classList.contains("project-tree-file-name"))
      refactor($self,e.target)
      */
}
