function dialogNameResolver(file, ext) {
  return new Promise((resolve, reject) => {
    var prompt = promptDialog({
      label: "Insert file ." + ext + " name:",
      buttonName: "CREATE",
      checkOnSubmit: true,
      patternFunction: (value, target) => {
        value = value.trim();
        return !value.match(/[()\/><?:%*"|\\]+/);
      },
      patternExpl: "file name cannot contain /\\?%*:|\"<> characters"
    });
    prompt.events.on("submit",prompte => {
      dialog.open("processing file...", true);
      tilepieces.utils.processFile(file, tilepieces.miscDir + "/" + prompte + "." + ext)
        .then(filepath => {
          dialog.close();
          resolve(filepath)
        }, err => reject(err));
    });
    prompt.events.on("reject",prompte =>{
      reject();
    });
  });
}