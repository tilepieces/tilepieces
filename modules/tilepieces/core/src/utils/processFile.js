async function processFile(file, path, docPath) {
  if (Number(tilepieces.imageTypeProcess) == 64) {
    return new Promise((res, rej) => {
      var reader = new FileReader();
      reader.addEventListener("load", () => res(reader.result));
      reader.addEventListener("abort", e => {
        dialog.open(e.toString());
        rej(e);
      });
      reader.addEventListener("error", e => {
        dialog.open(e.toString());
        rej(e);
      });
      reader.readAsDataURL(file);
    })
  }
  path = path || (tilepieces.utils.paddingURL(tilepieces.miscDir) + file.name);
  await tilepieces.storageInterface.update(path, file);
  return tilepieces.relativePaths ? tilepieces.utils.getRelativePath(docPath || tilepieces.utils.getDocumentPath(),
    path) : path[0] == "/" ? path : "/" + path;
}