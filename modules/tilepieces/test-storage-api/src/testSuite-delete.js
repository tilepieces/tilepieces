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