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