async function copy() {
  logOnDocument("copy", "larger");
  var copy1 = await storageInterface.copy(
    "js", "copyJs");
  logOnDocument(
    assert(copy1.newPath == "copyJs",
      "copy1 == \"copyJs\"")
    , "success");
  var read = await storageInterface.read("copyJs/vendor/test.js");
  logOnDocument(
    assert(read == "alert('ok from js/vendor/test.js')",
      "js dir copied to copyJs")
    , "success");
  var copy3 = await storageInterface.copy(
    "copyJs/vendor/test.js", "copyJs/vendor/test2.js");
  logOnDocument(
    assert(copy3.newPath == "copyJs/vendor/test2.js",
      "copy3 == \"copyJs/vendor/test2.js\"")
    , "success");
  var copy2 = await storageInterface.copy(
    "copyJs/vendor/test.js", "test-copy.js", true);
  logOnDocument(
    assert(copy2.newPath == "test-copy.js",
      "move copyJs/vendor/test.js to test-copy.js")
    , "success");
  var read3 = await storageInterface.read("copyJs/vendor/test2.js");
  logOnDocument(
    assert(read3 == "alert('ok from js/vendor/test.js')",
      "copyJs/vendor/test.js copied to test-copy.js")
    , "success");
  read = await storageInterface.read("test-copy.js");
  logOnDocument(
    assert(read == "alert('ok from js/vendor/test.js')",
      "copyJs/vendor/test.js copied to test-copy.js")
    , "success");
  var copy4 = await storageInterface.copy(
    "copyJs/vendor/test2.js", "copyJs/vendor/test3.js", true);
  logOnDocument(
    assert(copy4.newPath == "copyJs/vendor/test3.js",
      "move copyJs/vendor/test2.js to copyJs/vendor/test3.js")
    , "success");
  try {
    await storageInterface.read("copyJs/vendor/test2.js");
  } catch (e) {
    logOnDocument("copyJs/vendor/test2.js correctly moved", "success")
  }

  var read2;
  try {
    read2 = await storageInterface.read("copyJs/vendor/test.js");
  } catch (e) {
    logOnDocument("copyJs/vendor/test.js correctly moved", "success")
  }
  if (read2)
    logOnDocument("copyJs/vendor/test.js was not moved", "error")
}