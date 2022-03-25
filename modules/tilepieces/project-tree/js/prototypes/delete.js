ProjectTree.prototype.delete = function (path, delEl, dispatch = true) {
  var $self = this;
  if (!$self.selected.length)
    return;
  return new Promise((resolve,reject)=>{
    var DOMelement = delEl || $self.target.querySelector("[data-path='" + path + "']");
    function del() {
      $self.selected.slice($self.selected.indexOf(DOMelement), 1);
      DOMelement.parentElement.removeChild(DOMelement);
      resolve()
    }
    if (dispatch)
      this.events.dispatch("delete", {
        path: path || DOMelement.dataset.path,
        isFile: !!DOMelement.dataset.file,
        file: DOMelement.dataset.file,
        dir: DOMelement.dataset.dir,
        validate: del,
        reject
      });
    else
      del()
  })
};