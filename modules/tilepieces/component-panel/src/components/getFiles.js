async function getFiles(globs, project) {
  var search = await app.storageInterface.search(
    project.path, globs, null);
  var files = search.searchResult;
  var f = [];
  for (var i = 0; i < files.length; i++) {
    var filePath = files[i];
    var file = await app.storageInterface.read(filePath);
    f.push({
      path: filePath,
      file
    })
  }
  return f;
}