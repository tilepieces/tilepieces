function ptOpenTree(data) {
  return new Promise((res, rej) => {
    storageIntegration.read(data.path).then(readDir => {
      pt.update(data.DOMel, readDir.value);
      opener.dispatchEvent(new Event("project-tree-open-dir"));
      res();
    }, err => {
      console.error("[error in opening directory]", err);
      alertDialog("Error in opening directory " + data.path);
      rej();
    })
  });
}