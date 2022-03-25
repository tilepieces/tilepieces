ProjectTree.prototype.paste = function () {
  var $self = this;
  console.log("paste", $self.memory, $self.selected);
  if ($self.memory && $self.selected.length) {
    $self.events.dispatch("paste", {
      oldPaths: $self.memory.selected.reduce((filtered, option) => {
        if (!option.contains($self.selected[0]))
          filtered.push({
            path: option.dataset.path,
            isFile: !!option.dataset.file,
            file: option.dataset.file,
            dir: option.dataset.dir
          });
        return filtered;
      }, []).sort((a, b) => { // sort from the deep level to the superficial one, to prevent to delete directory in which there are files schedule to be copy/move
        return b.path.split("/").length - a.path.split("/").length;
      }),
      newPath: $self.selected[0].dataset.path,
      dir: $self.selected[0],
      type: $self.memory.type
    });
    $self.memory = null;
  }
}