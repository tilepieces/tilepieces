(()=>{
function click($self, e) {
  e.preventDefault();
  if (e.target.classList.contains("tooltip-toggler")) { // open/close tooltip
    $self.events.dispatch("open-tooltip", {
      path: e.target.parentNode.parentNode.dataset.path,
      DOMel: e.target.parentNode.parentNode,
      file: e.target.parentNode.parentNode.dataset.file,
      e
    })
  } else if (e.target.classList.contains("project-tree-caret")) { // open/close tree
    var isOpen = e.target.parentNode.classList.toggle("project-tree-caret__open");
    if (isOpen)
      $self.events.dispatch("openTree", {
        path: e.target.parentNode.parentNode.dataset.path,
        DOMel: e.target.parentNode.parentNode
      })
  } else if (!e.ctrlKey && !e.shiftKey) selection($self, e)
}

ProjectTree.prototype.copy = function () {
  var $self = this;
  $self.memory = {
    type: "copy",
    selected: $self.selected.slice(0) // clone array
  };
  console.log("copy", $self.selected, $self.memory);
}
ProjectTree.prototype.cut = function () {
  //$self.selected.forEach(v=>v.classList.add("project-tree-cut"));
  var $self = this;
  $self.memory = {
    type: "cut",
    selected: $self.selected.slice(0) // clone array
  };
  console.log("cut", $self.selected, $self.memory);
}
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
function multiselection($self, e) {
  console.log("multiselection", e);
  if (!$self.selected.length)
    return;
  var targetElement = e.target.nodeName != "LI" ? e.target.closest("li") : e.target;

  function cycle(t, siblingPath) {
    var original = t;
    var target = t;
    do {
      selection($self, {target, shiftKey: true});
      if (target === targetElement)
        return;
    } while (target = target[siblingPath]);
    //var parent = original.parentElement.closest("li[data-path]");
    //parent && parent[siblingPath] && cycle(parent,siblingPath);
  }

  if ($self.selected.length > 1) {
    for (var i = $self.selected.length - 2; i >= 0; i--)
      $self.selected[i].classList.remove("project-tree-selected")
    $self.selected.splice(0, $self.selected.length - 1);
  }
  var elToStart = $self.selected[0];
  if (offset(elToStart).top < offset(targetElement).top) // from top to bottom
    cycle(elToStart, "nextElementSibling");
  else
    cycle(elToStart, "previousElementSibling");
}
function onRenameKeydown(e) {
  if (e.key == "Enter") {
    e.preventDefault();
    e.target.dispatchEvent(new Event("blur"));
  }
}
function onRenamePaste(e) {
  e.preventDefault();
  var t = e.target;
  var clipboardData = e.clipboardData;
  if (clipboardData && clipboardData.getData) {
    var text = clipboardData.getData("text/plain");
    if (text.length) {
      var sel, range;
      sel = t.ownerDocument.defaultView.getSelection();
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(t.ownerDocument.createTextNode(text));
    }
  }
}
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
function read($self, e) {
  e.preventDefault();
  var targetElement = e.target.nodeName != "LI" ? e.target.closest("li") : e.target;
  if (!targetElement) {
    console.error(e);
    return;
  }
  if (targetElement.classList.contains("project-tree-file"))
    $self.events.dispatch("fileSelected", {
      path: targetElement.dataset.path,
      file: targetElement.dataset.file
    });
  /*
  if(e.target.classList.contains("project-tree-directory-name") ||
      e.target.classList.contains("project-tree-file-name"))
      refactor($self,e.target)
      */
}

function redo($self, e) {
  console.log("redo", e);
}
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
function selection($self, e) {
  var targetElement = e.target.hasAttribute("data-path") ? e.target : e.target.closest("[data-path]");
  if (e.ctrlKey && !e.shiftKey && targetElement.classList.contains("project-tree-selected")) {
    targetElement.classList.remove("project-tree-selected");
    $self.selected.splice($self.selected.indexOf(targetElement), 1);
    //disable grab
    if (!$self.justWatch) {
      var grabber = targetElement.querySelector(".project-tree-grabber");
      grabber && grabber.classList.remove("__drag-cursor-grab");
    }
    return;
  } else if (!e.ctrlKey && !e.shiftKey) { // single selection
    $self.removeAllSelections();
  }
  $self.selected.indexOf(targetElement) == -1 && $self.selected.push(targetElement);
  // setting the toggler...
  var pos = $self.target.getBoundingClientRect().left - targetElement.getBoundingClientRect().left;
  targetElement.style.setProperty('--left',
    pos + "px");
  targetElement.style.setProperty('--left-positive',
    (-pos) + "px");
  targetElement.classList.add("project-tree-selected");
  //enable grab
  if (!$self.justWatch) {
    var grabber = targetElement.querySelector(".project-tree-grabber");
    grabber && grabber.classList.add("__drag-cursor-grab");
  }
  $self.events.dispatch("fileHighlighted", {
    path: targetElement.dataset.path,
    file: targetElement.dataset.file
  });
}
function undo($self, e) {
  console.log("undo", e);
}
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
ProjectTree.prototype.removeAllSelections = function () {
  this.selected.forEach(v => {
    v.classList.remove("project-tree-selected");
    //disable grab
    var grabber = v.querySelector(".project-tree-grabber");
    grabber && grabber.classList.remove("__drag-cursor-grab");
  });
  this.selected = [];

}
function renderDir(key, DOMelement, documentTarget) {
  var li = documentTarget.createElement("li");
  li.classList.add("project-tree-directory");
  li.innerHTML = `<div class="selector"><a href="#" class="tooltip-toggler">...</a>` +
    `<span class="project-tree-grabber"></span>
            <span class="project-tree-key-name">${key}</span><span class='project-tree-caret'></span></div>`;
  li.dataset.path = DOMelement.dataset.path ? DOMelement.dataset.path + "/" + key : key;
  li.dataset.dir = key;
  return li;
}
function renderFile(key, DOMelement, documentTarget) {
  var li = documentTarget.createElement("li");
  var extension = key.split(".").pop()
  li.classList.add("project-tree-file",extension);
  li.innerHTML = `<div class="selector"><a href="#" class="tooltip-toggler">...</a>` +
    `<span class="project-tree-grabber"></span>
        <span class="project-tree-key-name">${key}</span></div>`;
  li.dataset.path = DOMelement.dataset.path ? DOMelement.dataset.path + "/" + key : key;
  li.dataset.file = key;
  return li;
}
function renderJSONel(key, DOMelement, value, documentTarget) {
  var li = documentTarget.createElement("li");
  li.classList.add("project-tree-file");
  li.innerHTML = `<span class="project-tree-grabber __drag-cursor-grab"></span>
        <span class="project-tree-key-name">${key}</span>:
        <span class="project-tree-key-value">${'' + value}</span>`;
  li.dataset.path = DOMelement.dataset.path ? DOMelement.dataset.path + "/" + key : key;
  li.dataset.file = key;
  return li;
}
ProjectTree.prototype.update = function (path, values) {
  var $self = this;
  var DOMelement = typeof path !== "string" ? path :
    $self.target.querySelector("[data-path='" + path + "']");
  var hasUl = DOMelement.querySelector("ul");
  if (hasUl) { // empty element for update, remove selected
    $self.selected.forEach(v => {
      if (hasUl.contains(v)) {
        v.classList.remove("project-tree-selected");
        $self.selected.splice($self.selected.indexOf(v), 1);
      }
    });
    DOMelement.removeChild(DOMelement.children[DOMelement.children.length - 1]);
  }
  var docFrag = new DocumentFragment();
  var documentTarget = $self.target.ownerDocument;
  var ul = documentTarget.createElement("ul");
  /* FILES MANAGEMENT */
  if ($self.fileRenderMode) { // renderMode is the only at the moment
    var dir = [];
    var files = [];
    for (var k in values) {
      if (typeof values[k] === "string")
        files.push(k)
      else
        dir.push(k)
    }
    dir.sort((a, b) => a.localeCompare(b)).forEach(key => {
      var li = renderDir(key, DOMelement, documentTarget);
      ul.appendChild(li);

    });
    files.sort((a, b) => a.localeCompare(b)).forEach(key => {
      var li = renderFile(key, DOMelement, documentTarget);
      ul.appendChild(li);
    });

  } else {
    for (var k in values) {
      var li;
      // object, but not  null ( which is an object in JS )
      if (typeof values[k] === "object" && values[k])
        li = renderDir(k, DOMelement, documentTarget);
      else
        li = renderJSONel(k, DOMelement, values[k], documentTarget)
      ul.appendChild(li);
    }
  }
  docFrag.appendChild(ul);
  DOMelement.appendChild(docFrag);
};

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


})();