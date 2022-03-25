async function createProject(name,filePath = ""){
  dialog.open("Opening Project...", true);
  try {
    var newProject = await storageInterface.create(name);
    newProject = Object.assign({},newProject);
    await tilepieces.getSettings();
    dialog.close();
    var lastFileOpened = filePath;
    checkIfUpdateFileIsEmpty({detail:{name:newProject.name,lastFileOpened}})
  } catch (e) {
    dialog.close();
    console.error("[error in Opening project]", e);
    alertDialog("error in creating project: " + name);
  }
}