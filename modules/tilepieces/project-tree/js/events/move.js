function move($self, element) {
  var pos1 = 0, pos2 = 0, moved = false;
  var clones = [], dirSelected;
  var drag = __drag(element, {
    handle: ".project-tree-selected > div > .project-tree-grabber"
  });
  var dummy = document.querySelector("body>dummy-drag");
  if (!dummy) {
    dummy = document.createElement("dummy-drag");
    document.body.appendChild(dummy);
  }
  drag.on("down", function (e) {
    e.ev.preventDefault();
    if (!$self.selected.length)
      return;
    pos1 = e.x;
    pos2 = e.y;
    $self.selected.forEach(select => dummy.appendChild(select.cloneNode(true)))
  })
    .on("move", function (e) {
      e.ev.preventDefault();
      if ((Math.abs(pos1 - e.x) > 5 || Math.abs(pos2 - e.y) > 5 || moved) && $self.selected.length) {
        moved = true;
        dummy.style.transform = "translate3d(" + e.x + "px," + e.y + "px,0)";
        dirSelected && dirSelected.classList.remove("__drag__drop-overlay");
        dirSelected = e.target.closest("[data-dir]");
        dirSelected && dirSelected.classList.add("__drag__drop-overlay");
      }
    })
    .on("up", function (e) {
      e.ev.preventDefault();
      if (dirSelected) {
        $self.events.dispatch("paste", {
          oldPaths: $self.selected.reduce((filtered, option) => {
            if (!option.contains(dirSelected) && option !== dirSelected &&
              option.parentNode.parentNode !== dirSelected)
              filtered.push({
                path: option.dataset.path,
                isFile: !!option.dataset.file,
                file: option.dataset.file,
                dir: option.dataset.dir
              });
            return filtered;
          }, []).sort((a, b) => { // sort from the deep level to the superficial one, to prevent to delete directory in which there are files schedulet to be copy/move
            return b.path.split("/").length - a.path.split("/").length;
          }),
          newPath: dirSelected.dataset.path,
          dir: dirSelected,
          type: "cut"
        });
        dirSelected.classList.remove("__drag__drop-overlay");
        dirSelected = null;
        $self.removeAllSelections();
      }
      clones = [];
      dummy.style.transform = "translate3d(-9999px,-9999px,0)";
      dummy.innerHTML = "";
      moved = false;
    });
  return {
    destroy: drag.destroy
  }
}