ProjectTree.prototype.cut = function () {
  //$self.selected.forEach(v=>v.classList.add("project-tree-cut"));
  var $self = this;
  $self.memory = {
    type: "cut",
    selected: $self.selected.slice(0) // clone array
  };
  console.log("cut", $self.selected, $self.memory);
}