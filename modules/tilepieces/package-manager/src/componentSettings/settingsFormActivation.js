function settingsFormActivation(component, isLocal) {
  var isComponent = component;
  settingsModel.__project = app.project;
  if (!isComponent) {
    console.log("[not a component]");
    settingsModel = JSON.parse(JSON.stringify(componentSettingsModel));
    settingsModel.iscomponent = "hidden";
    settingsModel.__project = app.project;
    settingsTT.set("", settingsModel);
    return;
  }
  settingsModel.__local = isLocal;
  settingsModel.iscomponent = "";
  settingsModel.addDependenciesToBundles = isComponent.addDependenciesToBundles || false;
  settingsModel.name = isComponent.name || app.project.name;
  settingsModel.description = isComponent.description || "";
  settingsModel.version = isComponent.version || "";
  settingsModel.author = isComponent.author || "";
  settingsModel.website = isComponent.website || "";
  settingsModel.repository = isComponent.repository || "";
  settingsModel.html = isComponent.html || "";
  settingsModel.path = isComponent.path || "";
  settingsModel.parseHTML = isComponent.parseHTML || "";
  settingsModel.terserConfiguration = isComponent.terserConfiguration || "";
  settingsModel.skipMatchAll= isComponent.skipMatchAll || false;
  var iframePath = settingsModel.__local ? settingsModel.path + "/" : "/";
  var absoulteAppFrameRes = app.frameResourcePath()[0] == "/" ? app.frameResourcePath() : "/" + app.frameResourcePath();
  settingsModel.iframePath = (absoulteAppFrameRes + (iframePath[0] == "/" ? iframePath : "/" + iframePath) + settingsModel.html)
    .replace(/\/\//g, "/");
  settingsModel.fixedHTML = isComponent.fixedHTML || false;
  settingsModel.dependencies = isComponent.dependencies ?
    isComponent.dependencies.map((v, i) => {
      var newObj = {};
      newObj.index = i;
      newObj.name = v;
      return newObj;
    }) : [];
  settingsModel.bundle = {
    stylesheet: isComponent.bundle && isComponent.bundle.stylesheet ?
      Object.keys(isComponent.bundle.stylesheet).map((v, i) => {
        return {name: v, value: isComponent.bundle.stylesheet[v], index: i};
      }) : [],
    stylesheetHeader: isComponent.bundle?.stylesheetHeader || "",
    stylesheetFooter: isComponent.bundle?.stylesheetFooter || "",
    scriptHeader: isComponent.bundle?.scriptHeader || "",
    scriptFooter: isComponent.bundle?.scriptFooter || "",
    script: isComponent.bundle && isComponent.bundle.script ?
      Object.keys(isComponent.bundle.script).map((v, i) => {
        return {name: v, value: isComponent.bundle.script[v], index: i};
      }) : []
  };
  settingsModel.components = isComponent.components || {};
  settingsModel.mergeMiscellaneous = isComponent.mergeMiscellaneous || false;
  settingsModel.miscellaneous = isComponent.miscellaneous ? isComponent.miscellaneous.map((v, i) => {
    var newObj = {};
    newObj.index = i;
    newObj.src = v;
    return newObj;
  }) : [];
  settingsModel.sources.scripts = isComponent.sources && isComponent.sources.scripts ?
    isComponent.sources.scripts.map((v, i) => {
      var newObj = {};
      newObj.index = i;
      newObj.value = v;
      return newObj;
    }) : [];
  settingsModel.sources.stylesheets = isComponent.sources && isComponent.sources.stylesheets ?
    isComponent.sources.stylesheets.map((v, i) => {
      var newObj = {};
      newObj.index = i;
      newObj.value = v;
      return newObj;
    }) : [];
  settingsModel.interface = isComponent.interface || "";
  settingsModel.selector = isComponent.selector || "";
  settingsTT.set("", settingsModel);
}

opener.addEventListener("delete-project", e => {
  app.iscomponent = "hidden";
})