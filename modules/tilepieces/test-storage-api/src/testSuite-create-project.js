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
    Object.values(configurationJson).length == 2;
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