function openSubPackage(projectName, path) {
  openerDialog.open("Creating Project...", true);
  app.storageInterface.create(projectName, path).then(res => {
    openerDialog.close();
    opener.dispatchEvent(new CustomEvent('set-project', {
      detail: res
    }))
  }, e => {
    openerDialog.close();
    console.error("[error in creating project]", e);
    alertDialog("error in creating project: " + projectName);
  })
}

localComponents.addEventListener("click", e => {
  if (!e.target.classList.contains("project-name-open"))
    return;
  var projectName = "@component/" + app.currentProject + "/" + e.target.__project.name;
  var path = e.target.__project.path;
  openSubPackage(projectName, path)
});
globalComponents.addEventListener("click", e => {
  if (!e.target.classList.contains("project-name-open"))
    return;
  var projectName = "@component/" + e.target.__project.name;
  openSubPackage(projectName)
});

