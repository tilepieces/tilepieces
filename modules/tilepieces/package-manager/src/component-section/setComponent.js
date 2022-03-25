componentsDialog.addEventListener("click", async e => {
  var target = e.target;
  if (!e.target.classList.contains("set-component"))
    return;
  var componentSettingsSibling = componentSettings.nextSibling; // is local components...
  var hidden = componentSettings.hidden;
  if (hidden)
    componentSettings.hidden = false;
  UserIsWritingComponentMetadata = true;
  var component = target.__project;
  settingsFormActivation(component, true);
  var d = dialog.open(componentSettings, false, true);
  d.events.on("close", async e => {
    await app.getSettings();
    localComponentsUITemplate.set("localComponents", turnComponentsToArray(app.localComponents));
    componentSettingsSibling.parentNode.insertBefore(componentSettings, componentSettingsSibling);
    settingsFormActivation(app.isComponent);
    if (hidden)
      componentSettings.hidden = true;
    UserIsWritingComponentMetadata = false;
    target.__project = app.localComponentsFlat[component.name];
  });
})