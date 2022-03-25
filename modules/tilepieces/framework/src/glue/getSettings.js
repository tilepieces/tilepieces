function getSettings() {
  return new Promise((res, rej) => {
    tilepieces.storageInterface.getSettings().then(response => {
      tilepieces.projects = response.settings.projects;
      tilepieces.globalComponents = response.settings.components;
      tilepieces.globalSettings = response.settings.globalSettings;
      if (tilepieces.project)
        updateSettings(tilepieces.project.name);
      window.dispatchEvent(new Event("settings-updated"));
      res(response.settings)
    }, err => {
      console.error("[error in reading settings]", err);
      alertDialog("error in reading settings");
      rej();
    });
  });
}

tilepieces.getSettings = getSettings;