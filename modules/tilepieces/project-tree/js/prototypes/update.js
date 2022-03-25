ProjectTree.prototype.update = function (path, values) {
  var $self = this;
  var DOMelement = typeof path !== "string" ? path :
    $self.target.querySelector("[data-path='" + path + "']");
  var hasUl = DOMelement.querySelector("ul");
  if (hasUl) { // empty element for update, remove selected
    $self.selected.forEach(v => {
      if (hasUl.contains(v)) {
        v.classList.remove("project-tree-selected");
        $self.selected.splice($self.selected.indexOf(v), 1);
      }
    });
    DOMelement.removeChild(DOMelement.children[DOMelement.children.length - 1]);
  }
  var docFrag = new DocumentFragment();
  var documentTarget = $self.target.ownerDocument;
  var ul = documentTarget.createElement("ul");
  /* FILES MANAGEMENT */
  if ($self.fileRenderMode) { // renderMode is the only at the moment
    var dir = [];
    var files = [];
    for (var k in values) {
      if (typeof values[k] === "string")
        files.push(k)
      else
        dir.push(k)
    }
    dir.sort((a, b) => a.localeCompare(b)).forEach(key => {
      var li = renderDir(key, DOMelement, documentTarget);
      ul.appendChild(li);

    });
    files.sort((a, b) => a.localeCompare(b)).forEach(key => {
      var li = renderFile(key, DOMelement, documentTarget);
      ul.appendChild(li);
    });

  } else {
    for (var k in values) {
      var li;
      // object, but not  null ( which is an object in JS )
      if (typeof values[k] === "object" && values[k])
        li = renderDir(k, DOMelement, documentTarget);
      else
        li = renderJSONel(k, DOMelement, values[k], documentTarget)
      ul.appendChild(li);
    }
  }
  docFrag.appendChild(ul);
  DOMelement.appendChild(docFrag);
};
