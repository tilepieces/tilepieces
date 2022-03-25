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