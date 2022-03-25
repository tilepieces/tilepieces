function changeSettingsInPage(propName, propValue) {
  tilepieces[propName] = propValue
  if (propName == "panelPosition")
    changePanelsPosition(propValue);
  if (propName == "sandboxFrame")
    changeSandboxAttribute(propValue);
}

tilepieces.changeSettingsInPage = changeSettingsInPage;