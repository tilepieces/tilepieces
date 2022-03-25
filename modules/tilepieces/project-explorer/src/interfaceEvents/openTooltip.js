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