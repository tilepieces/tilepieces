ProjectTree.prototype.removeAllSelections = function () {
  this.selected.forEach(v => {
    v.classList.remove("project-tree-selected");
    //disable grab
    var grabber = v.querySelector(".project-tree-grabber");
    grabber && grabber.classList.remove("__drag-cursor-grab");
  });
  this.selected = [];

}