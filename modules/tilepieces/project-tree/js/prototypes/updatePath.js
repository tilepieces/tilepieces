ProjectTree.prototype.updatePath = function (path, nodeType) {
  var $self = this;
  var DOMelement = typeof path !== "string" ? path :
    $self.target.querySelector("[data-path='" + path + "']");
  if (DOMelement && nodeType == "file") {
    console.warn("updatePath called with path already present")
    return;
  }
  var splittedPath = path.split("/");
  var name = splittedPath.pop();
  console.log(name);
  for (var i = splittedPath.length; i >= 0; i--) {
    path = splittedPath.filter((v, ind) => ind < i).join("/");
    console.log(path);
    console.log(splittedPath[i]);
    DOMelement = $self.target.querySelector("[data-path='" + path + "']");
    if (DOMelement) {
      if (splittedPath[i + 1]) {
        name = splittedPath[i + 1] || name;
        nodeType = "directory";
      }
      break;
    }
  }
  if (!DOMelement)
    return;
  var Ul = DOMelement.querySelector("ul");
  if (!Ul) {
    console.error("update Path no ul");
    return;
  }
  var dirChilds = [...Ul.children].filter(v => v.dataset.dir).map(v => v.dataset.dir);
  var fileChilds = [...Ul.children].filter(v => v.dataset.file).map(v => v.dataset.file);
  var documentTarget = $self.target.ownerDocument;
  var li;
  if (nodeType == "file") {
    var entries = fileChilds.concat([name]).sort((a, b) => a.localeCompare(b));
    var newIndex = entries.indexOf(name) + dirChilds.length;
    li = renderFile(name, DOMelement, documentTarget);
  } else {
    var entries = dirChilds.concat([name]).sort((a, b) => a.localeCompare(b));
    var newIndex = entries.indexOf(name);
    li = renderDir(name, DOMelement, documentTarget);
  }
  if (newIndex < Ul.children.length)
    Ul.children[newIndex].before(li);
  else
    Ul.append(li);
};
