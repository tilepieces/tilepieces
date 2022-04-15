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
  var exPanelPosition = tilepieces.panelPosition;
  var exSandboxFrame = tilepieces.sandboxFrame;
  for(var k in proj) {
    tilepieces[k] = proj[k];
  }
  for(var g in tilepieces.globalSettings){
    if(!proj[g])
      tilepieces[g] = tilepieces.globalSettings[g];
  }
  // change settings events
  var panelPosition = tilepieces.project.panelPosition || tilepieces.globalSettings.panelPosition;
  if (panelPosition != exPanelPosition)
    changeSettingsInPage("panelPosition", panelPosition);
  var sandboxFrame = tilepieces.globalSettings.sandboxFrame;
  if (typeof tilepieces.project.sandboxFrame == "boolean")
    sandboxFrame = tilepieces.project.sandboxFrame;
  if (!!sandboxFrame != !!exSandboxFrame)
    changeSettingsInPage("sandboxFrame", sandboxFrame);
}

tilepieces.updateSettings = updateSettings;