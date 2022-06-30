function changeSettingsInPage(propName, propValue) {
  tilepieces[propName] = propValue
  if (propName == "panelPosition")
    changePanelsPosition(propValue);
  if (propName == "sandboxFrame")
    changeSandboxAttribute(propValue);
  if(propName == "skipMatchAll")
    tilepieces.currentPage && tilepieces.setFrame(tilepieces.currentPage.path);
}

tilepieces.changeSettingsInPage = changeSettingsInPage;