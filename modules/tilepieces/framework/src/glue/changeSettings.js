async function changeSettings(propName, propValue, set = true) {
  var projectSettings = {};
  projectSettings[propName] = propValue;
  try {
    set && await tilepieces.storageInterface.setSettings({projectSettings});
  } catch (e) {
    console.error(e);
    return;
  }
  changeSettingsInPage(propName, propValue)
}

tilepieces.changeSettings = changeSettings;