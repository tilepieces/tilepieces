async function changeGlobalSettings(propName, propValue, set = true) {
  var settings = {};
  settings[propName] = propValue;
  try {
    set && await tilepieces.storageInterface.setSettings({settings});
  } catch (e) {
    console.error(e);
    return;
  }
  if (propName == "panelPosition")
    changeSettingsInPage(propName, propValue)
}

tilepieces.changeGlobalSettings = changeGlobalSettings;