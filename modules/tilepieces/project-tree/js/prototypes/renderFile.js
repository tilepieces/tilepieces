function renderFile(key, DOMelement, documentTarget) {
  var li = documentTarget.createElement("li");
  var extension = key.split(".").pop()
  li.classList.add("project-tree-file",extension);
  li.innerHTML = `<div class="selector"><a href="#" class="tooltip-toggler">...</a>` +
    `<span class="project-tree-grabber"></span>
        <span class="project-tree-key-name">${key}</span></div>`;
  li.dataset.path = DOMelement.dataset.path ? DOMelement.dataset.path + "/" + key : key;
  li.dataset.file = key;
  return li;
}