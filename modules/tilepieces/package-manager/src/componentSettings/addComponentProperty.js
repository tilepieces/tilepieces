function addComponentProperty(obj) {
  switch (obj) {
    case "dependencies":
      settingsModel.dependencies.push({
        index: settingsModel.dependencies.length,
        name: ""
      });
      break;
    case "components":
      settingsModel.components.push({
        index: settingsModel.components.length,
        name: ""
      });
      break;
    case "templates":
      settingsModel.templates.push({
        index: settingsModel.templates.length,
        src: ""
      });
      break;
    case "miscellaneous":
      settingsModel.miscellaneous.push({
        index: settingsModel.miscellaneous.length,
        src: ""
      });
      break;
    case "bundle.stylesheet":
      settingsModel.bundle.stylesheet.push(
        {
          name: "attr-" + settingsModel.bundle.stylesheet.length, value: "",
          index: settingsModel.bundle.stylesheet.length
        });
      break;
    case "bundle.script":
      settingsModel.bundle.script.push({
        name: "attr-" + settingsModel.bundle.script.length, value: "",
        index: settingsModel.bundle.script.length
      });
      break;
    case "sources.stylesheet":
      settingsModel.sources.stylesheets.push({
        index: settingsModel.sources.stylesheets.length,
        value: ""
      });
      break;
    case "sources.script":
      settingsModel.sources.scripts.push({
        index: settingsModel.sources.scripts.length,
        value: ""
      });
      break;
  }
  submitSettings();
}