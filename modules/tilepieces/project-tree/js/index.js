function ProjectTree(target, firstModel, name = "Unknown Object", fileRenderMode = true, justWatch = false) {
  var $self = this;
  $self.selected = [];
  $self.events = events();
  $self.on = $self.events.on;
  $self.target = target;
  $self.justWatch = justWatch;
  $self.fileRenderMode = fileRenderMode;
  var clickEvents = (e) => click($self, e);
  var contextMenuEvent = (e) => {
    e.preventDefault();
    selection($self, e);
    var togglerPath = e.target.closest("[data-path]");
    $self.events.dispatch("open-tooltip", {
      path: togglerPath.dataset.path,
      DOMel: togglerPath,
      file: togglerPath.dataset.file,
      e
    })
  };
  target.addEventListener("click", clickEvents);
  target.addEventListener("contextmenu", contextMenuEvent);
  if (!justWatch) {
    var dblClick = (e) => read($self, e);
    var mv = move($self, target);
    $self.shortcuts = new Shortcuts(target, {exclude: "[contenteditable=true]"});
    $self.history = []; // TODO never used
    $self.memory = null;
    // binding events
    target.addEventListener("dblclick", dblClick);
    $self.shortcuts.on("cut", () => $self.cut());
    $self.shortcuts.on("copy", () => $self.copy());
    $self.shortcuts.on("paste", () => $self.paste());
    $self.shortcuts.on("undo", e => undo($self, e));
    $self.shortcuts.on("redo", e => redo($self, e));
    $self.shortcuts.on("selection", e => selection($self, e));
    $self.shortcuts.on("multiselection", e => multiselection($self, e));
    $self.shortcuts.on("delete", async e => {
      var sorted = $self.selected.sort((a, b) => {
        // sort from the deep level to the superficial one, to prevent to delete directory in which there are files scheduled to be copy/move
        return b.dataset.path.split("/").length - a.dataset.path.split("/").length;
      })
      for(var i = 0;i<sorted.length;i++){
        var v = sorted[i];
        try {
          await $self.delete(v.dataset.path, v);
        }
        catch(e){
          console.warn("deleting ", v.dataset.path , " aborted");
        }
      }
    });
    $self.destroy = () => {
      mv.destroy();
      $self.shortcuts.destroy();
      target.removeEventListener("click", clickEvents);
      target.removeEventListener("dblclick", dblClick);
      target.removeEventListener("contextmenu", contextMenuEvent);
      target.innerHTML = "";
    };
  } else
    $self.destroy = () => {
      target.removeEventListener("click", clickEvents);
      target.innerHTML = "";
    };
  // init
  var div = target.ownerDocument.createElement("div");
  div.classList.add("project-tree", "project-tree-root");
  div.innerHTML = `<div class=selector><a href=# class="tooltip-toggler">...</a>` + `<span class="project-tree-key-name">${name}</span>
    <span class="project-tree-caret"></span></div>`;
  div.dataset.path = "";
  div.dataset.dir = "";
  target.appendChild(div);
  $self.update(div, firstModel);
  return $self;
};
window.ProjectTree = ProjectTree;

