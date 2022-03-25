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