const opener = window.opener ? window.opener : window.parent;
const storageIntegration = opener.storageInterface;
const allowedExtToEdit = ["js", "mjs", "json", "html", "htm", "css", "ts", "svg", "xml","txt"];
const app = opener.tilepieces;
const dialog = opener.dialog;
const confirmDialog = opener.confirmDialog;
const alertDialog = opener.alertDialog;
const promptDialog = opener.promptDialog;
const tooltipEl = document.getElementById("project-menu-tooltip");
const editSourceCode = document.getElementById("edit-source-code");
const tooltipCopy = document.getElementById("project-tree-copy");
const tooltipCut = document.getElementById("project-tree-cut");
const tooltipPaste = document.getElementById("project-tree-paste");
const openInNewWindow = document.getElementById("open-in-new-window");
const projectTreeAddFileWrapper = document.getElementById("project-tree-add-file-wrapper");
const ptframe = document.getElementById("project-tree-element");
const projectWrapper = document.getElementById("project-wrapper");
const projectTreeWrapper = document.getElementById("project-tree-wrapper");
const buttonCreateFile = document.getElementById("project-tree-create-file");
const fileList = document.getElementById("project-tree-file-list");
const buttonCreateDir = document.getElementById("project-tree-create-dir");
const buttonAddFile = document.getElementById("project-tree-add-file");
const buttonDeleteFile = document.getElementById("project-tree-delete");
const buttonRefactorFile = document.getElementById("project-tree-refactor");
const newFileDialog = document.getElementById("new-file-form-template");
let pt;
const HTMLTextTemplate = (text) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><title></title><meta name="description" content=""><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body><div>${text}</div></body></html>`;
function ptDelete(data) {
  var confirm = confirmDialog(`Do you want to delete ${data.path}?`);
  confirm.events.on("confirm",value=>{
    if(value)
      confirmDelete(data)
    else
      data.reject();
  });
}
function confirmDelete(data) {
  storageIntegration.delete(data.path).then(res => {
    data.validate();
    opener.dispatchEvent(new CustomEvent('file-deleted',
      {
        detail: {
          path: data.path,
          data
        }
      }
    ));
  }, err => {
    console.error("[error in deleting path]", err);
    alertDialog("Error in deleting path " + data.path);
  })
}
function ptFileHighlighted(data) {
}
function ptFileSelected(data) {
  storageIntegration.read(data.path).then(fileText => {
    var path = data.path;
    var name = path.split("/").pop();
    opener.dispatchEvent(new CustomEvent('file-selected',
      {
        detail: {
          path,
          name,
          ext: name.includes(".") ?
            name.split('.').pop() :
            null,
          file: fileText,
          fileText,
          data
        }
      }
    ));
  }, err => {
    console.error("[error in opening file]", err);
    alertDialog("Error in opening file " + data.path);
  })
}

/*
loadFile.addEventListener("click",e=> {
    var selected = pt && pt.selected[0];
    if(selected){
        ptFileSelected({
            path : selected.dataset.path,
            file : selected.dataset.file
        })
    }
});
    */
async function openRecursively(path,dblClick) {
  var isPresentPath = path[0] == "/" ? path.substring(1) : path;
  var isPresent = pt.target.querySelector(`[data-path="${isPresentPath}"]`);
  if (isPresent && isPresent.classList.contains("project-tree-selected")) {
    var rect = isPresent.getBoundingClientRect();
    var isVisible = (rect.top >= 0) && (rect.bottom <= window.innerHeight)
    !isVisible &&
    isPresent.scrollIntoView();
    return;
  }
  if (path[0] != "/") path = "/" + path;
  var pathSplitted = path.split("/");
  var partialPath = "";
  for (var i = 0; i < pathSplitted.length; i++) {
    var partOfPath = pathSplitted[i];
    if (partOfPath && partialPath)
      partialPath += "/" + partOfPath;
    else if (partOfPath && !partialPath)
      partialPath = partOfPath;
    var target = pt.target.querySelector(`[data-path${partialPath ? `="${partialPath}"` : ""}]`);
    if (!target)
      return;
    if (i != pathSplitted.length - 1) {
      target.querySelector(".selector").classList.add("project-tree-caret__open");
      try {
        await ptOpenTree({
          path: target.dataset.path,
          DOMel: target
        })
      } catch (e) {
        console.error("[error in opening directory]", e);
        alertDialog("Error in opening directory " + partialPath);
      }
    } else {
      target.scrollIntoView();
      if(dblClick)
        target.dispatchEvent(new MouseEvent("dblclick",{bubbles:true}));
      else
        target.click()
    }
  }
}
function openTooltip(e) {
  var path = e.path;
  var name = path.split("/").pop();
  var ext = name.includes(".") ?
    name.split('.').pop() :
    "";
  var isFile = e.file;
  var isRoot = e.DOMel.classList.contains("project-tree-root");
  tooltipCopy.hidden = isRoot;
  tooltipCut.hidden = isRoot;
  tooltipPaste.hidden = !pt.memory || isFile;
  editSourceCode.hidden = !isFile; //|| allowedExtToEdit.indexOf(ext) < 0;
  openInNewWindow.hidden = ext != "htm" && ext != "html";
  buttonCreateFile.hidden = isFile;
  buttonCreateDir.hidden = isFile;
  projectTreeAddFileWrapper.hidden = isFile;
  buttonRefactorFile.hidden = isRoot;
  tooltip(e.e);
}
function ptOpenTree(data) {
  return new Promise((res, rej) => {
    storageIntegration.read(data.path).then(readDir => {
      pt.update(data.DOMel, readDir.value);
      opener.dispatchEvent(new Event("project-tree-open-dir"));
      res();
    }, err => {
      console.error("[error in opening directory]", err);
      alertDialog("Error in opening directory " + data.path);
      rej();
    })
  });
}
async function ptPaste(data) {
  console.log("paste received:", data);
  dialog.open("copying files...", true);
  if (!data.oldPaths.length) {
    dialog.close();
    console.error("move no valid paths, return;");
    alertDialog("invalid move");
    return;
  }
  var move = data.type == "cut";
  for (var i = 0; i < data.oldPaths.length; i++) {
    var oldPath = data.oldPaths[i];
    var namePath = oldPath.file || oldPath.dir;
    var newPath = data.newPath + "/" + namePath;
    try {
      var copy = await storageIntegration.copy(oldPath.path, newPath, move);
    } catch (e) {
      dialog.close();
      console.error("[error in copying/moving files]", e);
      alertDialog("Error in copying/moving file " + oldPath.path + " in " + data.newPath + "/" + namePath);
      return;
    }
    move && pt.delete(oldPath.path, null, false);
    console.log("copy files ", copy);
    if(i == data.oldPaths.length-1){
      openRecursively(copy.newPath,true);
    }
  }

  // dispatch "paste"
  opener.dispatchEvent(new CustomEvent('file-pasted',
    {
      detail: {
        path: data.newPath,
        oldPath: oldPath.path
      }
    }
  ));
  dialog.close();
}
function ptRefactor(data) {
  var confirm = confirmDialog(`Do you want to refactor ${data.oldName} in ${data.newName}?`);
  confirm.events.on("confirm",value=>{
    if(value)
      confirmRefactor(data)
  });
}

function confirmRefactor(data) {
  var parentPath = data.path.split("/");
  parentPath.pop();
  parentPath = parentPath.length ? parentPath.join("/") + "/" : "";
  var newPath = parentPath + data.newName
  storageIntegration.copy(parentPath + data.oldName,
    newPath, true).then(rename => {
    data.validate();
    storageIntegration.read(newPath).then(newValue => {
      if (!data.isFile)
        pt.update(data.selected, newValue.value);
      else
        openRecursively(newPath,true);
      opener.dispatchEvent(new CustomEvent('file-renamed',
        {
          detail: {
            newName: data.newName,
            oldName: data.oldName,
            newPath: parentPath + data.newName,
            oldPath: parentPath + data.oldName,
            file: newValue
          }
        }
      ));
    }, err => {
      console.error("[error in reading path after refactoring]", err);
      alertDialog("Error in reading path " + data.path + " after refactoring");
    })
  }, err => {
    console.error("[error in refactoring path]", err);
    alertDialog("Error in deleting path " + data.path);
  })
}

buttonAddFile.addEventListener("change", async e => {
  if (pt && pt.selected[0] && pt.selected[0].hasAttribute("data-dir")) {
    var path = pt.selected[0].dataset.path;
    if (e.target.files.length)
      for (var i = 0; i < e.target.files.length; i++) {
        var fileName = e.target.files[i].name;
        var newPath = path + "/" + fileName;
        try {
          var up = await storageIntegration.update(
            newPath,
            e.target.files[i]
          );
        } catch (e) {
          console.error("[error in adding files]", e);
          alertDialog("Error in adding file " + fileName + "in path " + newPath);
          return;
        }
      }
    /*
    try {
        var read = await storageIntegration.read(path);
    }
    catch(e){
        console.error("[error in reading files after adding files]",e);
        alertDialog("Error in reading file in  " + path + " after adding files");
        return;
    }
    pt.update(pt.selected[0],read.value);*/
  }
})

buttonCreateDir.addEventListener("click", ev => {
  if (!pt || !pt.selected[0] || !pt.selected[0].hasAttribute("data-dir")) // dataset can't be reliable because data-dir could be empty
    return;
  var prompt = promptDialog({
    label: "New directory name:",
    buttonName: "CREATE",
    checkOnSubmit: true,
    patternFunction: (value, target) => {
      value = value.trim();
      return !value.match(/[()\/><?:%*"|\\]#+/);
    },
    patternExpl: "Directory name cannot contain /\\?%*:|\"<># characters"
  });
  prompt.events.on("submit",value=>createFile(null, true, value));
});
// close list when not focus
//projectWrapper.ownerDocument.addEventListener("click",e=>e.target!=buttonCreateFile && fileList.classList.remove("display"));
//projectWrapper.ownerDocument.defaultView.addEventListener("blur",e=>fileList.classList.remove("display"));
fileList.addEventListener("click", ev => {
  if (!pt || !pt.selected[0] || !pt.selected[0].hasAttribute("data-dir")) // dataset can't be reliable because data-dir could be empty
    return;
  if (ev.target.nodeName != "LI")
    return;
  var type = ev.target.dataset.type ? "." + ev.target.dataset.type : "";
  var prompt = promptDialog({
    label: `New file ${type ? type + " " : ""}name:`,
    buttonName: "CREATE",
    checkOnSubmit: true,
    patternFunction: (value, target) => {
      value = value.trim();
      return !value.match(/[()\/><?:%*"|\\]+#/);
    },
    patternExpl: "File name cannot contain /\\?%*:|\"<># characters"
  });
  prompt.events.on("submit",value=>createFile(type, false, value));
});

async function createFile(extension, dir, filename) { // add a file/directory
  var selected = pt.selected[0],
    path = selected.dataset.path;
  var newFile = dir ? filename : filename + extension;
  var date = new Date();
  var value = extension == ".html" ?
    HTMLTextTemplate(`data:text/plain;created on path:"${path}" on date ${date}`) : "";
  var newPath = (path ? path + "/" : "") + newFile.trim();
  try {
    var up = await storageIntegration.update(newPath, dir ? null : new Blob([value]));
  } catch (err) {
    cacheSelector = null;
    console.error("[error in creating path]", err);
    alertDialog("Error in creating new path " + newPath);
  }
  openRecursively(newPath,true);
}
tooltipCopy.addEventListener("click", e => {
  pt.copy();
  tooltipEl.style.display = "none";
});
tooltipCut.addEventListener("click", e => {
  pt.cut();
  tooltipEl.style.display = "none";
});
tooltipPaste.addEventListener("click", e => {
  pt.paste();
  tooltipEl.style.display = "none";
});
buttonDeleteFile.addEventListener("click", e => {
  if (pt && pt.selected[0])
    pt.delete(null, pt.selected[0]);
});
editSourceCode.addEventListener("click", e => {
  var selected = pt && pt.selected[0];
  var ext = selected.dataset.file.split('.').pop();
  storageIntegration.read(selected.dataset.path).then(fileText => {
    if(typeof fileText != "string"){
      alertDialog("This file appears not to be a \"text file\" and therefore cannot be opened.", true);
      return;
    }
    app.codeMirrorEditor(fileText, ext)
      .then(res => {
        dialog.open("saving file...", true);
        app.updateFile(selected.dataset.path, res, 0).then(() => {
          if (app.currentPage && app.currentPage.path == selected.dataset.path)
            app.frame.contentWindow.location.reload();
          dialog.close();
        })
      }, e => {
        if(e) { // codeMirrorEditor returns undefined when closed without clicking the "done" button
          dialog.close();
          alertDialog(e.error || e.err || e.toString(), true);
          console.error(e)
        }
      })
  }, e => {
    alertDialog(e.error || e.err || e.toString(), true);
    console.error(e)
  });
});
//var wrapper = document.getElementById("project-tree-wrapper");
//var wrapperText = wrapper.children[0];
//var wrapperTrigger = wrapper.children[1];
if (app.currentProject) {
  storageIntegration.read("").then(res => {
    pt = new ProjectTree(projectTreeWrapper, res.value, app.currentProject);
    ptInterface(pt);
    projectWrapper.style.display = "block";
    app.currentPage && app.currentPage.path &&
    openRecursively(app.currentPage.path);
  }, err => {
    console.error("[error in reading project]", err);
    alertDialog("Error in reading project " + app.currentProject);
  })
}
opener.addEventListener("set-project", async e => {
  pt && pt.destroy();
  pt = new ProjectTree(projectTreeWrapper, e.detail.schema, app.currentProject);
  ptInterface(pt);
  //wrapperText.textContent = e.detail.name;
  projectWrapper.style.display = "block";

});
opener.addEventListener("html-rendered", e => {
  app.currentPage && app.currentPage.path && pt &&
  openRecursively(app.currentPage.path);
});
opener.addEventListener('delete-project', e => {
  pt && pt.destroy();
  pt = null;
  //wrapperText.textContent = "";
  projectWrapper.style.display = "none";
});
opener.addEventListener("project-explorer-highlight-path",e=>{
  openRecursively(e.detail.path,e.detail.dblClick)
})
/*
projectWrapper.addEventListener("click",e=>{
    projectWrapper.classList.toggle("project-tree-caret__open");
});*/
function ptInterface(pt) {
  pt.on("openTree", ptOpenTree);
  pt.on("fileSelected", ptFileSelected);
  //pt.on("fileHighlighted",ptFileHighlighted);
  pt.on("paste", ptPaste);
  pt.on("refactor", ptRefactor);
  pt.on("delete", ptDelete);
  pt.on("open-tooltip", openTooltip);
}

buttonCreateFile.addEventListener("click", e => {
  buttonCreateFile.classList.toggle("selected");
});
//tooltipEl.addEventListener("blur",e=>tooltipEl.style.display="none");
projectTreeWrapper.addEventListener("click", e => {
  if (tooltipEl.style.display != "none" &&
    !tooltipEl.contains(e.target))
    tooltipEl.style.display = "none"
});
window.addEventListener("blur", e => tooltipEl.style.display = "none");
/*
window.addEventListener("window-popup-open",async e=>{
    var dockableElement = e.detail.dockableElement;
    var dockableElementIframe = e.detail.dockableElementIframe;
    var newWindow = e.detail.newWindow;
    var iframeWindow = dockableElementIframe.contentDocument.defaultView;
    if(!ptframe)
        return;
    var read = await opener.storageInterface.read("");
    var openerPT = dockableElementIframe.contentDocument.defaultView.pt;
    if(openerPT){
        openerPT.removeAllSelections();
        var newPtFrame = document.importNode(dockableElementIframe.contentDocument.defaultView.pt.target,true);
        pt = new ProjectTree(ptframe, read.value);
        openerPT && ptframe.replaceChild(newPtFrame.children[0],ptframe.children[0]);
        ptInterface(pt);
    }
});
window.addEventListener("window-popup-close",e=>{
    var dockableElement = e.detail.dockableElement;
    var dockableElementIframe = e.detail.dockableElementIframe;
    var newWindow = e.detail.newWindow;
    if(!ptframe)
        return;
    var imp = document.adoptNode(ptframe,true);
    document.body.appendChild(imp);
    if(newWindow.pt) {
        newWindow.pt.removeAllSelections();
        var newPtFrame = document.importNode(newWindow.pt.target, true);
        ptframe.replaceChild(newPtFrame.children[0], ptframe.children[0]);
    }
    //ptInterface(opener.frontartApp.currentProject,pt);
});
    */
openInNewWindow.addEventListener("click", e => {
  var path = pt && pt.selected[0] && pt.selected[0].dataset.path;
  if (path) {
    var w = window.open(
      location.origin + "/" + app.frameResourcePath() + "/" + path, "_blank");
    w.opener = null;
  }
});
buttonRefactorFile.addEventListener("click", e => {
  if (pt && pt.selected[0]) {
    pt.refactor(pt, pt.selected[0]);
    tooltipEl.style.display = "none";
  }
});
opener.addEventListener("tilepieces-file-updating", async e => {
  if(!pt)
    return;
  var path = e.detail.path;
  if (path[0] == "/")
    path = path.substring(1);
  var isDirectory = e.detail.isDirectory;
  var exists = pt && pt.target.querySelector("[data-path='" + path + "']");
  if (!exists) {
    var splitted = path.split("/");
    splitted.pop();
    if (pt.target.querySelector("[data-path='" + splitted.join("/") + "']")) {
      console.log("[project-tree tilepieces-file-updating]", path, isDirectory);
      pt.updatePath(path, isDirectory ? "directory" : "file");
    }
  } else if (exists && isDirectory) {
    try {
      var newPath = await storageIntegration.read(path);
      pt.update(path, newPath.value);
    } catch (e) {
      console.error("[error in reading path after copying/moving]", e);
      alertDialog("Error in reading path " + data.newPath + " after copying/moving");
    }
  }
});
function tooltip(e, el) {
  //overlay.blur();
  var domElement = tooltipEl;
  if (domElement.contains(e.target) || domElement == e.target)
    return;
  var x = e.pageX;
  var y = e.pageY;
  var win = e.target.getRootNode().defaultView;
  var zero = win.scrollY;
  if (domElement.style.display != "block") {
    domElement.style.display = "block";
  }
  var sel = domElement.querySelector(".selected");
  sel && sel.classList.remove("selected");
  domElement.focus();
  var box = domElement.getBoundingClientRect();
  if (x + box.width > win.innerWidth) {
    x = x - box.width;
    if (x < zero) x = zero;
  }
  if (y + box.height > win.innerHeight) {
    y = y - box.height;
    if (y < zero) y = zero;
  }
  domElement.style.transform = `translate(${x}px,${y}px)`;
}
