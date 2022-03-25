function renderDir(key, DOMelement, documentTarget) {
  var li = documentTarget.createElement("li");
  li.classList.add("project-tree-directory");
  li.innerHTML = `<div class="selector"><a href="#" class="tooltip-toggler">...</a>` +
    `<span class="project-tree-grabber"></span>
            <span class="project-tree-key-name">${key}</span><span class='project-tree-caret'></span></div>`;
  li.dataset.path = DOMelement.dataset.path ? DOMelement.dataset.path + "/" + key : key;
  li.dataset.dir = key;
  return li;
}