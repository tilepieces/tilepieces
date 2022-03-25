function renderJSONel(key, DOMelement, value, documentTarget) {
  var li = documentTarget.createElement("li");
  li.classList.add("project-tree-file");
  li.innerHTML = `<span class="project-tree-grabber __drag-cursor-grab"></span>
        <span class="project-tree-key-name">${key}</span>:
        <span class="project-tree-key-value">${'' + value}</span>`;
  li.dataset.path = DOMelement.dataset.path ? DOMelement.dataset.path + "/" + key : key;
  li.dataset.file = key;
  return li;
}