componentSettingsForm.addEventListener("click", e => {
  if (e.target.tagName == "BUTTON" && !e.target.classList.contains("component-settings-save"))
    e.preventDefault();
});
componentSettingsForm.addEventListener("submit", e => e.preventDefault());

async function submitSettings() {
  console.log("submit settings");
  var name = settingsModel.name.trim() || app.currentProject;
  var path = "/" + app.applicationName + "/" + app.componentPath +
    "/" + name;
  var dependencies = [];
  var components = {};
  if (settingsModel.dependencies)
    settingsModel.dependencies.forEach(d => dependencies.push(d.name.trim()));
  //settingsModel.components.forEach(d=>components[d.name.trim()] = app.project.components[d.name.trim()]);
  var component = {
    name,
    description: settingsModel.description.trim() || "",
    version: settingsModel.version.trim() || "",
    author: settingsModel.author.trim() || "",
    website: settingsModel.website.trim() || "",
    repository: settingsModel.repository.trim() || "",
    html: settingsModel.html.trim(),
    addDependenciesToBundles: settingsModel.addDependenciesToBundles,
    bundle: {
      stylesheet: settingsModel.bundle.stylesheet.reduce((a, v) => {
        a[v.name.trim()] = v.value.trim();
        return a;
      }, {}),
      stylesheetHeader: settingsModel.bundle.stylesheetHeader,
      stylesheetFooter: settingsModel.bundle.stylesheetFooter,
      scriptHeader: settingsModel.bundle.scriptHeader,
      scriptFooter: settingsModel.bundle.scriptFooter,
      script: settingsModel.bundle.script.reduce((a, v) => {
        a[v.name.trim()] = v.value.trim();
        return a;
      }, {})
    },
    sources: {
      stylesheets: settingsModel.sources.stylesheets.map(v => v.value.trim()),
      scripts: settingsModel.sources.scripts.map(v => v.value.trim())
    },
    dependencies,
    mergeMiscellaneous: settingsModel.mergeMiscellaneous || false,
    miscellaneous: settingsModel.miscellaneous.map(v => v.src.trim()),
    selector: settingsModel.selector.trim(),
    interface: settingsModel.interface.trim(),
    fixedHTML: settingsModel.fixedHTML,
    parseHTML: settingsModel.parseHTML,
    terserConfiguration : settingsModel.terserConfiguration,
    skipMatchAll : settingsModel.skipMatchAll,
    path: settingsModel.__local ? settingsModel.path || ("/" + app.componentPath +
      "/" + name) : ""
  };
  try {
    var setComponentInProject = await app.storageInterface.createComponent({
      local: !!settingsModel.__local,
      component: component
    });
    await app.getSettings();
    settingsFormActivation(component, settingsModel.__local);
  } catch (e) {
    console.error("error in updating component.json", e);
    openerDialog.open("error in updating component.json");
  }
};