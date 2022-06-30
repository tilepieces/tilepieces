async function changeSettings(propName, propValue, set = true) {
  var projectSettings = {};
  projectSettings[propName] = propValue;
  try {
    set && await tilepieces.storageInterface.setSettings({projectSettings});
    tilepieces.project[propName] = propValue;
    tilepieces.projects.find(v=>v.name == tilepieces.project.name)[propName] = propValue;
  } catch (e) {
    console.error(e);
    return;
  }
  changeSettingsInPage(propName, propValue)
}

tilepieces.changeSettings = changeSettings;