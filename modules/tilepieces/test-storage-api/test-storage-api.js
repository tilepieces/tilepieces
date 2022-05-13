(()=>{
(async function () {
  try {
    await deleteProject();
    await createProject();
    await updateRead();
    await search();
    await copy();
    await deleteFiles();
    await createComponentFromProject();
    await createComponentWithFiles();
    await projectReading();
    await deleteComponents();
    await settings();
    await deleteProject();
    logOnDocument(
      assert(
        true,
        "ALL TESTS ARE COMPLETED!")
      , "success");
  } catch (e) {
    console.error(e);
    logOnDocument(e.err || e.error || e.toString(), "error");
  }
})();
async function copy() {
  logOnDocument("copy", "larger");
  await storageInterface.copy(
    "js", "copyJs");
  var read = await storageInterface.read("copyJs/vendor/test.js");
  logOnDocument(
    assert(read == "alert('ok from js/vendor/test.js')",
      "js dir copied to copyJs")
    , "success");
  await storageInterface.copy(
    "copyJs/vendor/test.js", "test-copy.js", true);
  read = await storageInterface.read("test-copy.js");
  logOnDocument(
    assert(read == "alert('ok from js/vendor/test.js')",
      "copyJs/vendor/test.js copied to test-copy.js")
    , "success");
  var read2;
  try {
    read2 = await storageInterface.read("copyJs/vendor/test.js");
  } catch (e) {
    logOnDocument("copyJs/vendor/test.js correctly moved", "success")
  }
  if (read2)
    logOnDocument("copyJs/vendor/test.js was not moved", "error")
}
async function createComponentFromProject() {
  logOnDocument("Create components", "larger");
  //
  logOnDocument("- create component from project", "large");
  //
  await storageInterface.createComponent({
    component: componentModel("test")
  });
  var settings = await storageInterface.getSettings();
  logOnDocument(
    assert(settings.settings.components["test"].name == "test", "expect global component 'test'")
    , "success");
  // read the main json
  var mainJson = await fetch("/components.json").then(res => res.json());
  var isPathRight = (mainJson.test.path == "www\\test" || mainJson.test.path == "www/test");
  var test3 = isPathRight &&
    Object.values(mainJson).length == 1 &&
    Object.values(mainJson.test).length == 2;
  //
  logOnDocument(
    assert(test3, "check if /components.json is correct")
    , "success");
  //
  logOnDocument("- create a local component, called 'local-test'", "large");
  //
  await storageInterface.createComponent({
    local: true,
    component: componentModel("local-test")
  });
  settings = await storageInterface.getSettings();
  var projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(projectTest.components["local-test"].name == "local-test",
      "local-test is saved as component in project settings")
    , "success");
  var compcomponents = settings.settings.components["test"].components;
  logOnDocument(
    assert(!compcomponents || !compcomponents["local-test"],
      "while there is not a 'components' record in 'component' (no update, because is a component of the project, not of the component)")
    , "success");
  var readNewDir = await storageInterface.read("components/local-test");
  var dirCorrectlyCreated =
    JSON.stringify({"tilepieces.component.json": "tilepieces.component.json"}) == JSON.stringify(readNewDir.value);
  logOnDocument(
    assert(dirCorrectlyCreated, "dir created and correctly readed")
    , "success");
  //
  logOnDocument("- create a inner component, called 'test/local-test'", "large");
  //
  var newComponentModel = componentModel("test/local-test");
  newComponentModel.path = "/components/test/local-test";
  await storageInterface.createComponent({
    local: true,
    component: newComponentModel
  });
  settings = await storageInterface.getSettings();
  projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(projectTest.componentsFlat["test/local-test"].name == "test/local-test",
      "test/local-test is in 'componentsFlat' record inside 'test' project")
    , "success");
  logOnDocument(
    assert(projectTest.components.test.components["test/local-test"].name == "test/local-test",
      "test/local-test is in 'components' record inside 'test' component in 'test' project")
    , "success");
  logOnDocument(
    assert(settings.settings.components["test"].components["test/local-test"].name == "test/local-test",
      "there is a component 'test/local-test' recorded in 'test' component")
    , "success");
  readNewDir = await storageInterface.read("components/test/local-test");
  dirCorrectlyCreated =
    JSON.stringify({"tilepieces.component.json": "tilepieces.component.json"}) == JSON.stringify(readNewDir.value);
  logOnDocument(
    assert(dirCorrectlyCreated, "dir created and correctly readed")
    , "success");
  // read the main json remain the same
  mainJson = await fetch("/components.json").then(res => res.json());
  isPathRight = (mainJson.test.path == "www\\test" || mainJson.test.path == "www/test");
  test3 = isPathRight &&
    Object.values(mainJson).length == 1 &&
    Object.values(mainJson.test).length == 2;
  logOnDocument(
    assert(test3, "check if /components.json is correct")
    , "success");
  // now check the components json
  var cJson = await storageInterface.read("tilepieces.component.json").then(res => JSON.parse(res));
  logOnDocument(
    assert(cJson.name == "test" &&
      Object.values(cJson.components).length == 1 &&
      cJson.components["test/local-test"].path == "/components/test/local-test"
      , "check if /components.json is correct")
    , "success");
  // check the project json
  var projectJson = await storageInterface.read("tilepieces.project.json").then(res => JSON.parse(res));
  logOnDocument(
    assert(projectJson.name == "test" &&
      Object.values(projectJson.components).length == 1 &&
      projectJson.components["local-test"].path == "/components/local-test"
      , "check if /tilepieces.project.json is correct")
    , "success");
  var componentJson = await storageInterface.read("tilepieces.component.json").then(res => JSON.parse(res));
  logOnDocument(
    assert(componentJson.name == "test" &&
      Object.values(componentJson.components).length == 1 &&
      componentJson.components["test/local-test"].path == "/components/test/local-test"
      , "check if /tilepieces.component.json is correct")
    , "success");
  // now check if there are the inner components files
  var cJson1 = await storageInterface.read("components/test/local-test/tilepieces.component.json")
    .then(res => JSON.parse(res));
  var cJson2 = await storageInterface.read("components/local-test/tilepieces.component.json")
    .then(res => JSON.parse(res));
  logOnDocument(
    assert(cJson1.name == "test/local-test" &&
      cJson2.name == "local-test"
      , "check if inner components json is correct")
    , "success");
  // ------------- //
  c = componentModel("test/local-test/sub");
  await storageInterface.createComponent({
    local: true,
    component: c
  });
  var settings = await storageInterface.getSettings();
  var projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(projectTest.componentsFlat["test/local-test/sub"].name == "test/local-test/sub" &&
      projectTest.componentsFlat["test/local-test/sub"].path == "/components/test/local-test/sub",
      "expect local component 'test/local-test/sub'")
    , "success");
  mainJson = await storageInterface.read("components/test/local-test/sub/tilepieces.component.json")
    .then(res => JSON.parse(res));
  var assert1 = (mainJson.name == "test/local-test/sub");
  mainJson2 = await storageInterface.read("components/test/local-test/tilepieces.component.json").then(res => JSON.parse(res));
  var assert2 = (mainJson2.components["test/local-test/sub"] &&
    mainJson2.components["test/local-test/sub"].path == "/sub");
  mainJson3 = await storageInterface.read("/tilepieces.component.json").then(res => JSON.parse(res));
  var assert3 = (!mainJson3.components["test/local-test/sub"] && mainJson3.components["test/local-test"]);
  logOnDocument(
    assert(assert1 && assert2 && assert3)
    , "success");
  // ------------- //
  // ------------- //
  c = componentModel("local-test/sub");
  await storageInterface.createComponent({
    local: true,
    component: c
  });
  var settings = await storageInterface.getSettings();
  var projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(projectTest.componentsFlat["local-test/sub"].name == "local-test/sub" &&
      projectTest.componentsFlat["local-test/sub"].path == "/components/local-test/sub",
      "expect local component 'local-test/sub'")
    , "success");
  // read the main json
  mainJson = await storageInterface.read("components/local-test/sub/tilepieces.component.json").then(res => JSON.parse(res));
  var assert1 = (mainJson.name == "local-test/sub");
  mainJson2 = await storageInterface.read("components/local-test/tilepieces.component.json").then(res => JSON.parse(res));
  var assert2 = (mainJson2.components["local-test/sub"] &&
    mainJson2.components["local-test/sub"].path == "/sub");
  mainJson3 = await storageInterface.read("/tilepieces.project.json").then(res => JSON.parse(res));
  var assert3 = (!mainJson3.components["local-test/sub"] && mainJson3.components["local-test"]);
  logOnDocument(
    assert(assert1 && assert2 && assert3)
    , "success");
  // ------------- //
  // recreate "test" main component, to be sure components are saved
  await storageInterface.createComponent({
    component: componentModel("test")
  });
  var settings = await storageInterface.getSettings();
  var projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(projectTest.componentsFlat["test/local-test/sub"].name == "test/local-test/sub" &&
      projectTest.componentsFlat["test/local-test/sub"].path == "/components/test/local-test/sub",
      "expect local component 'test/local-test/sub' after 'test' recreation")
    , "success");
  logOnDocument(
    assert(projectTest.componentsFlat["local-test/sub"].name == "local-test/sub" &&
      projectTest.componentsFlat["local-test/sub"].path == "/components/local-test/sub",
      "expect local component 'local-test/sub'  after 'test' recreation")
    , "success");
}
async function createComponentWithFiles() {
  logOnDocument("create components with files", "larger");
  var mockHTMLFetch = await fetch("mockFiles/mock.html");
  var mockHTML = await mockHTMLFetch.text();
  var files = [
    {
      path: "mock.html",
      blob: new Blob([mockHTML])
    },
    {
      path: "components.json",
      blob: await fetch("mockFiles/components.json").then(res => res.blob())
    },
    {
      path: "structure-html5.gif",
      blob: await fetch("mockFiles/structure-html5.gif").then(res => res.blob())
    }
  ];
  //
  logOnDocument("- create global component test2", "large");
  //
  test2Files = files.map(v => {
    var obj = Object.assign({}, v);
    return obj;
  });
  var componentModelTest2 = componentModel("test2");
  componentModelTest2.path = "components/test2";
  await storageInterface.createComponent({
    component: componentModelTest2
  }, test2Files);
  var settings = await storageInterface.getSettings();
  logOnDocument(
    assert(settings.settings.components["test2"].name == "test2", "There's a new global component called test2")
    , "success");
  var fetchC = await storageInterface.read("mock.html", "test2");
  logOnDocument(
    assert(fetchC == mockHTML, "component file created and readed")
    , "success");
  var fetchConf = await storageInterface.read("tilepieces.component.json", "test2");
  logOnDocument(
    "tilepieces.component.json has been created in component 'test2'<pre>" + fetchConf + "</pre>"
    , "success");
  var fetchd = await storageInterface.search("", "*.html", null, "test2");
  logOnDocument(
    assert(fetchd.searchResult[0] == "mock.html", "component search works on global component")
    , "success");
  //
  var innerTestFiles = files.map(v => {
    var obj = Object.assign({}, v);
    return obj;
  });
  await storageInterface.createComponent({
    local: true,
    component: componentModel("inner-test-with-files")
  }, innerTestFiles);
  settings = await storageInterface.getSettings();
  var projectTest = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(projectTest.componentsFlat["inner-test-with-files"].name == "inner-test-with-files",
      "inner-test-with-files is in project 'componentsFlat' record")
    , "success");
  logOnDocument(
    assert(projectTest.components["inner-test-with-files"].name == "inner-test-with-files",
      "inner-test-with-files is in project 'components' record")
    , "success");
  var fetchConf2 = await storageInterface.read("components/inner-test-with-files/tilepieces.component.json");
  logOnDocument(
    "tilepieces.component.json has been created in path components/inner-test-with-files/tilepieces.component.json<pre>" + fetchConf2 + "</pre>"
    , "success");
  await storageInterface.read("components/inner-test-with-files/components.json");
  await storageInterface.read("components/inner-test-with-files/mock.html");
  await storageInterface.read("components/inner-test-with-files/structure-html5.gif");
  // check the main component json
  // read the main json remain the same
  var mainJson = await fetch("/components.json").then(res => res.json());
  console.log("mainJson", mainJson);
  var isPathRight = (mainJson.test2.path == "components\\test2" || mainJson.test2.path == "components/test2");
  var test3 = isPathRight &&
    Object.values(mainJson).length == 2 &&
    Object.values(mainJson.test2).length == 2;
  logOnDocument(
    assert(test3, "check if /components.json is correct")
    , "success");
}
async function createProject() {
  logOnDocument("create a project", "larger");
  logOnDocument("- Create a new project called 'test':", "large");
  logOnDocument("(if test project was deleted from disk but not from project.json, it's normal to have an error. Refresh the page and test should go normal).", "large");
  var create = await storageInterface.create("test");
  console.log(create);
  logOnDocument("- Fetch Settings:");
  var settings = await storageInterface.getSettings();
  console.log(settings);
  var test = settings.settings.projects.find(v => v.name == "test");
  logOnDocument(
    assert(test, "expect find test project in settings")
    , "success");
  var configurationJson = await storageInterface.read("tilepieces.project.json")
    .then(res => JSON.parse(res));
  var test2 = !Array.isArray(configurationJson) && configurationJson.name == "test" &&
    JSON.stringify(configurationJson.components) == "{}" &&
    Object.keys(settings.settings.globalSettings).every(v=>typeof configurationJson[v] !== "undefined");
  logOnDocument(
    assert(test2, "expect project/tilepieces.project.json filled with properties 'name' and 'components'")
    , "success");
  var mainJson = await fetch("/projects.json").then(res => res.json());
  var isPathRight = (mainJson[0].path == "www\\test" || mainJson[0].path == "www/test");
  var test3 = Array.isArray(mainJson) &&
    mainJson.length == 1 &&
    isPathRight &&
    Object.values(mainJson[0]).length == 2;
  logOnDocument(
    assert(test3, "check if /projects.json is correct")
    , "success");
}
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
async function deleteProject() {
  logOnDocument("delete project", "larger");
  var newSettings = await storageInterface.getSettings();
  var prjs = newSettings.settings.projects;
  for (var i = 0; i < prjs.length; i++) {
    await storageInterface.delete(
      "", prjs[i].name);
  }
  newSettings = await storageInterface.getSettings();
  logOnDocument(
    assert(
      !newSettings.settings.projects.length,
      "all projects were successfully deleted")
    , "success");
  logOnDocument(
    assert(
      !Object.keys(newSettings.settings.components).length,
      "all components were successfully deleted")
    , "success");
}
async function deleteFiles() {
  logOnDocument("delete files", "larger");
  await storageInterface.delete(
    "test-copy.js");
  var read;
  try {
    read = await storageInterface.read("test-copy.js");
  } catch (e) {
    logOnDocument("test-copy.js correctly deleted", "success");
  }
  if (read)
    throw new Error("test-copy.js was not deleted");
  await storageInterface.delete(
    "copyJs");
  var read2;
  try {
    read2 = await storageInterface.read("copyJs");
  } catch (e) {
    logOnDocument("copyJs correctly deleted", "success")
  }
  if (read2)
    throw new Error("copyJs was not deleted");
}
async function projectReading() {
  logOnDocument("project reading", "larger");
  logOnDocument("- Create a new project called 'test2':", "large");
  logOnDocument("(if test project was deleted from disk but not from project.json, it's normal to have an error. Refresh the page and test should go normal).", "large");
  await storageInterface.create("test2");
  logOnDocument("- Fetch Settings:");
  var settings = await storageInterface.getSettings();
  var test = settings.settings.projects.find(v => v.name == "test2");
  logOnDocument(
    assert(test, "expect find test2 project in settings")
    , "success");
  logOnDocument("update index.html in it", "large");
  await storageInterface.update("index.html", new Blob(["test2"]));
  var read = await storageInterface.read("index.html");
  logOnDocument(
    assert(read == "test2", "index.html correctly updated in test2")
    , "success");
  var readOnTest = await storageInterface.read("index.html", null, "test");
  logOnDocument(
    assert(readOnTest == "test", "read on another project has been implemented correctly")
    , "success");
  readOnTest = await storageInterface.read("index.html", "test");
  logOnDocument(
    assert(readOnTest == "test", "read on component has been implemented correctly")
    , "success");
  logOnDocument("- Search on component (repeat search suite):", "large");
  await search("test");
  logOnDocument("- Search on project (repeat search suite):", "large");
  await search(null, "test");
  tilepieces.currentProject = "test";
  logOnDocument("now we move in 'test' changing tilepieces.currentProject", "large");
  read = await storageInterface.read("index.html");
  logOnDocument(
    assert(read == "test", "move has been implemented correctly")
    , "success");
}
async function search(cName, pName) {
  logOnDocument("search", "larger");
  var search = await storageInterface.search("", "index.html", null, cName, pName);
  logOnDocument(
    assert(search.searchResult.length == 1 &&
      search.searchResult[0] == "index.html",
      "search index.html works as expected")
    , "success");
  search = await storageInterface.search("", "**/*.js", null, cName, pName);
  logOnDocument(
    assert(search.searchResult.length == 2 &&
      search.searchResult.indexOf("js/js.js") > -1 &&
      search.searchResult.indexOf("js/vendor/test.js") > -1,
      "search **/*.js works as expected")
    , "success");
  search = await storageInterface.search("", "**/*.js", {pattern: "alert"}, cName, pName);
  logOnDocument(
    assert(search.searchResult.length == 1 &&
      search.searchResult[0] == "js/vendor/test.js",
      "search **/*.js with regex pattern 'alert' works as expected")
    , "success");
}
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
async function updateRead() {
  logOnDocument("Second Suite: update files", "larger");
  logOnDocument("- create index.html with value 'test':", "large");
  await storageInterface.update("index.html", new Blob(["test"]));
  var read = await storageInterface.read("index.html");
  logOnDocument(
    assert(read == "test", "index.html created and correctly readed")
    , "success");
  logOnDocument("- create directory css:", "large");
  await storageInterface.update("css");
  var readDirectory = await storageInterface.read("css");
  var dirCorrectlyCreated =
    JSON.stringify({}) == JSON.stringify(readDirectory.value);
  logOnDocument(
    assert(dirCorrectlyCreated, "dir created and correctly readed")
    , "success");
  logOnDocument("- create recursive file js/js.js with value '[]':");
  await storageInterface.update("js/js.js", new Blob(["[]"]));
  var readRecursive = await storageInterface.read("js/js.js");
  logOnDocument(
    assert(readRecursive == "[]", "js/js.js created and correctly readed")
    , "success");
  logOnDocument("- create recursive file js/vendor/test.js with value 'alert('ok from js/vendor/test.js')':");
  await storageInterface.update("js/vendor/test.js", new Blob(["alert('ok from js/vendor/test.js')"]));
  var res = await storageInterface.read("js/vendor/test.js");
  logOnDocument(assert(
      res == "alert('ok from js/vendor/test.js')", "file updated with response as expected")
    , "success");
}
})();