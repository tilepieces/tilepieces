tilepieces.toUpdateFileObject = {};
tilepieces.updateFile = (path, text, delay) => {
  return new Promise((resolve, reject) => {
    var updateFunction = tilepieces.storageInterface?.update;
    if(updateFunction) {
      clearTimeout(tilepieces.toUpdateFileObject[path]);
      tilepieces.toUpdateFileObject[path] = setTimeout(() => {
        var blobFile = new Blob([text]);
        updateFunction(path, blobFile)
          .then(r => {
              console.log("[UPDATING FILE] -> path updated: ", path, "\nresult: ", r);
              if (tilepieces.fileSelected.path == path) {
                tilepieces.fileSelected.file = text;
                tilepieces.fileSelected.fileText = text;
              }
              window.dispatchEvent(new CustomEvent("file-updated", {detail: {path, text}}));
              delete tilepieces.toUpdateFileObject[path];
              resolve(text);
            },
            err => {
              console.error("[UPDATING FILE] -> error updating path", err);
              window.dispatchEvent(new CustomEvent("error-file-updated", {detail: {path, text}}));
              dialog.open("error during updating current document");
              delete tilepieces.toUpdateFileObject[path];
              reject(err);
            });
      }, typeof delay !== "number" ? tilepieces.delayUpdateFileMs : delay)
    }
    else{
      resolve();
    }
  })
};