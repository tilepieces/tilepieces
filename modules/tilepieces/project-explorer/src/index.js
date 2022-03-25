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