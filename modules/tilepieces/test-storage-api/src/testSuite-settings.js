async function settings() {
  logOnDocument("settings");
  await storageInterface.setSettings(
    {
      projectSettings: {
        testKey: "testValueProj"
      },
      settings: {
        testKey: "testValue"
      }
    }
  );
  var newSettings = await storageInterface.getSettings();
  var globalSettings = newSettings.settings.globalSettings;
  var projectSettings = newSettings.settings.projects.find(p => p.name == "test");
  logOnDocument(
    assert(globalSettings.testKey == "testValue" &&
      projectSettings.testKey == "testValueProj",
      "settings changed as expected ( don't forget to remove 'testKey' from settings.json )")
    , "success");
}