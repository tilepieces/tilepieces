ProjectTree.prototype.copy = function () {
  var $self = this;
  $self.memory = {
    type: "copy",
    selected: $self.selected.slice(0) // clone array
  };
  $self.events.dispatch("copy",$self.selected);
  console.log("copy", $self.selected, $self.memory);
}