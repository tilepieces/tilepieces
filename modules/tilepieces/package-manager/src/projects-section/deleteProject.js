projectsDialog.addEventListener("click", e => {
  if (e.target.hasAttribute("data-remove-project"))
    deleteProject(e.target.__project.name);
});

function deleteProject(projectName) {
  var confirm = opener.confirmDialog("Are you sure you want to delete " + projectName);
  confirm.events.on("confirm",value=>{
    if(!value)
      return;
    openerDialog.open("Deleting '" + projectName + "' project...", true);
    app.storageInterface.delete("", projectName).then(data => {
      //openerDialog.close();
      opener.dispatchEvent(
        new CustomEvent('delete-project', {
          detail: {
            name: projectName,
            data
          }
        })
      )
    }, err => {
      console.error("[error in deleting project]", err);
      openerDialog.close();
      opener.alertDialog("Error in deleting project " + projectName);
    })
  });
}
