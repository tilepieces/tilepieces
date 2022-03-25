let modelProject = {
  files: [],
  "server": {
    "port": 8546,
    "host": "127.0.0.1"
  },
  "workspace": "",
  "applicationName": "",
  "panelPosition": "right",
  "APIInterface": "",
  "sandboxFrame": true,
  "componentPath": "components",
  "imageTypeProcess": 0,
  "delayUpdateFileMs": 500,
  "miscDir": "miscellaneous",
  "imageDir": "images",
  "currentStyleSheetAttribute": "data-tilepieces-current-stylesheet"
};

function assignModelProject() {
  var currentProjectMetadata = Object.assign({}, modelProject, app.project || {});
  if (currentProjectMetadata.files?.length) {
    currentProjectMetadata.files = currentProjectMetadata.files.map((v, i) => {
      var obj = {};
      obj.value = v;
      obj.index = i;
      return obj;
    })
  }
  return currentProjectMetadata;
}