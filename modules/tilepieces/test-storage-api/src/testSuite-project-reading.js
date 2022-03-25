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