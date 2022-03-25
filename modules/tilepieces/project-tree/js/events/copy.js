ProjectTree.prototype.copy = function () {
  var $self = this;
  $self.memory = {
    type: "copy",
    selected: $self.selected.slice(0) // clone array
  };
  console.log("copy", $self.selected, $self.memory);
}