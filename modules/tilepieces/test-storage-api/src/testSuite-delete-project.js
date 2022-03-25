async function deleteProject() {
  logOnDocument("delete project", "larger");
  var newSettings = await storageInterface.getSettings();
  var prjs = newSettings.settings.projects;
  for (var i = 0; i < prjs.length; i++) {
    await storageInterface.delete(
      "", prjs[i].name);
  }
  newSettings = await storageInterface.getSettings();
  logOnDocument(
    assert(
      !newSettings.settings.projects.length,
      "all projects were successfully deleted")
    , "success");
  logOnDocument(
    assert(
      !Object.keys(newSettings.settings.components).length,
      "all components were successfully deleted")
    , "success");
}