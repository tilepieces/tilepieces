ProjectTree.prototype.refactor = function ($self, el) {
  var oldName = el.dataset.file ? el.dataset.file :
    el.dataset.dir;
  var keyName = el.querySelector(".project-tree-key-name");

  function onRefactor(e) {
    keyName.textContent = keyName.textContent.trim();
    if (keyName.textContent != oldName) {
      var newName = keyName.textContent;
      keyName.textContent = oldName;
      $self.events.dispatch("refactor", {
        oldName: oldName,
        newName: newName,
        path: el.dataset.path,
        isFile: !!el.dataset.file,
        selected: el,
        validate: () => {
          keyName.textContent = newName;
          el.dataset.file ? el.dataset.file = newName : el.dataset.dir = newName;
          el.dataset.path = el.dataset.path.split("/").map((v, i, a) => {
            if (i == a.length - 1)
              return newName;
            else return v;
          }).join("/")
        }
      });
    }
    keyName.contentEditable = false;
    keyName.removeEventListener("blur", onRefactor);
    keyName.removeEventListener("paste", onRenamePaste);
    keyName.removeEventListener("keydown", onRenameKeydown);
    $self.removeAllSelections();
  }

  keyName.contentEditable = true;
  keyName.addEventListener("blur", onRefactor);
  keyName.addEventListener("paste", onRenamePaste);
  keyName.addEventListener("keydown", onRenameKeydown);
  keyName.focus();
}