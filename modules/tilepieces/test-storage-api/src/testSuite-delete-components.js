async function deleteComponents() {
  logOnDocument("delete components", "larger");
  //
  logOnDocument("- delete global component test2 (with files)", "large");
  //
  await storageInterface.deleteComponent({
    component: {name: "test2"},
    deleteFiles: true
  });
  var settings = await storageInterface.getSettings();
  logOnDocument(
    assert(typeof settings.settings.components["test2"] == "undefined", "Test2 was successfully removed from components.json")
    , "success");
  try {
    await storageInterface.read("mock.html", "test2");
    throw new Error({error: "file not deleted!"})
  } catch (e) {
    logOnDocument("component files deleted", "success");
  }

  await storageInterface.deleteComponent({
    local: true,
    component: {name: "inner-test-with-files"}
  });
  settings = await storageInterface.getSettings();
  var projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(typeof projectTest.componentsFlat["inner-test-with-files"] == "undefined",
      "inner-test-with-files correctly deleted in 'componentsFlat' record")
    , "success");
  logOnDocument(
    assert(typeof projectTest.components["inner-test-with-files"] == "undefined",
      "inner-test-with-files correctly deleted in project 'components' record")
    , "success");
  // ------
  //
  logOnDocument("- remove local component local-test/sub (with files)", "large");
  await storageInterface.deleteComponent({
    local: true,
    component: {name: "local-test/sub"},
    deleteFiles: true
  });
  settings = await storageInterface.getSettings();
  projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(typeof projectTest.componentsFlat["local-test/sub"] == "undefined",
      "test/local-test correctly deleted in project 'componentsFlat' record")
    , "success");
  var read;
  try {
    read = await storageInterface.read("components/local-test/sub");
  } catch (e) {
    logOnDocument("components/local-test/sub correctly deleted", "success")
  }
  if (read)
    logOnDocument("components/local-test/sub was not deleted", "error")
  // ------ //
  // test for broken subcomponent
  c = componentModel("test/local-test/sub2");
  await storageInterface.createComponent({
    local: true,
    component: c
  });
  await storageInterface.deleteComponent({
    local: true,
    component: {name: "test/local-test/sub2"},
    deleteFiles: true
  });
  settings = await storageInterface.getSettings();
  projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(typeof projectTest.componentsFlat["test/local-test/sub2"] == "undefined",
      "test/local-test correctly deleted in project 'test/local-test/sub2' record")
    , "success");
  var read;
  try {
    read = await storageInterface.read("components/test/local-test/sub2");
  } catch (e) {
    logOnDocument("components/test/local-test/sub2 correctly deleted", "success")
  }
  if (read)
    logOnDocument("components/test/local-test/sub2 was not deleted", "error")
  //
  logOnDocument("- remove local component test/local-test (with files)", "large");
  await storageInterface.deleteComponent({
    local: true,
    component: {name: "test/local-test"},
    deleteFiles: true
  });
  settings = await storageInterface.getSettings();
  projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(typeof projectTest.componentsFlat["test/local-test"] == "undefined",
      "test/local-test correctly deleted in project 'componentsFlat' record")
    , "success");
  logOnDocument(
    assert(typeof projectTest.components["test/local-test"] == "undefined",
      "test/local-test correctly deleted in project 'components' record")
    , "success");
  var read;
  try {
    read = await storageInterface.read("components/test/local-test");
  } catch (e) {
    logOnDocument("components/test/local-test correctly deleted", "success")
  }
  if (read)
    logOnDocument("components/test/local-test was not deleted", "error")
}