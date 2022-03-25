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