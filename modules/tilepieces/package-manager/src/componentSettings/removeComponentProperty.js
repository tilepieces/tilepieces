function removeComponentProperty(index, obj) {
  switch (obj) {
    case "dependencies":
      settingsModel.dependencies.splice(+index, 1);
      settingsModel.dependencies.forEach((v, i) => v.index = i);
      break;
    case "components":
      settingsModel.components.splice(+index, 1);
      settingsModel.components.forEach((v, i) => v.index = i);
      break;
    case "templates":
      settingsModel.templates.splice(+index, 1);
      settingsModel.templates.forEach((v, i) => v.index = i);
      break;
    case "miscellaneous":
      settingsModel.miscellaneous.splice(+index, 1);
      settingsModel.miscellaneous.forEach((v, i) => v.index = i);
      break;
    case "bundle.stylesheet":
      settingsModel.bundle.stylesheet.splice(+index, 1);
      settingsModel.bundle.stylesheet.forEach((v, i) => v.index = i);
      break;
    case "bundle.script":
      settingsModel.bundle.script.splice(+index, 1);
      settingsModel.bundle.script.forEach((v, i) => v.index = i);
      break;
    case "sources.stylesheet":
      settingsModel.sources.stylesheets.splice(+index, 1);
      settingsModel.sources.stylesheets.forEach((v, i) => v.index = i);
      break;
    case "sources.script":
      settingsModel.sources.scripts.splice(+index, 1);
      settingsModel.sources.scripts.forEach((v, i) => v.index = i);
      break;
  }
  //settingsModel.disabled = "";
  //settingsTT.set("",settingsModel);
  submitSettings();
}