opener.addEventListener("tilepieces-file-updating", async e => {
  var path = e.detail.path;
  if (path[0] == "/")
    path = path.substring(1);
  var isDirectory = e.detail.isDirectory;
  var exists = pt && pt.target.querySelector("[data-path='" + path + "']");
  if (!exists) {
    var splitted = path.split("/");
    splitted.pop();
    if (pt.target.querySelector("[data-path='" + splitted.join("/") + "']")) {
      console.log("[project-tree tilepieces-file-updating]", path, isDirectory);
      pt.updatePath(path, isDirectory ? "directory" : "file");
    }
  } else if (exists && isDirectory) {
    try {
      var newPath = await storageIntegration.read(path);
      pt.update(path, newPath.value);
    } catch (e) {
      console.error("[error in reading path after copying/moving]", e);
      alertDialog("Error in reading path " + data.newPath + " after copying/moving");
    }
  }
});