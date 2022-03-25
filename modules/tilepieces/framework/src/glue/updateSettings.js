function updateSettings(prName) {
  tilepieces.currentProject = prName;
  var proj = tilepieces.projects.find(v => v.name == tilepieces.currentProject);
  if (proj) {
    tilepieces.isComponent = proj.isComponent;
    if (tilepieces.isComponent)
      tilepieces.isComponent.path = "";
    tilepieces.localComponents = proj.components;
    tilepieces.localComponentsFlat = proj.componentsFlat;
    tilepieces.componentPath = proj.componentPath || "components";
  }
  tilepieces.project = Object.assign({}, proj);
  for(var k in proj)
    tilepieces[k] = proj[k];
  // change settings events
  var panelPosition = tilepieces.project.panelPosition || tilepieces.globalSettings.panelPosition;
  if (panelPosition != tilepieces.panelPosition)
    changeSettingsInPage("panelPosition", panelPosition);
  var sandboxFrame = tilepieces.globalSettings.sandboxFrame;
  if (typeof tilepieces.project.sandboxFrame == "boolean")
    sandboxFrame = tilepieces.project.sandboxFrame;
  if (!!sandboxFrame != !!tilepieces.sandboxFrame)
    changeSettingsInPage("sandboxFrame", sandboxFrame);
}

tilepieces.updateSettings = updateSettings;