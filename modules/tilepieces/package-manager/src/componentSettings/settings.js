componentSettingsForm.addEventListener("change", e => {
  console.log("change form", e);
  var target = e.target;
  var name = target.name;
  var value = target.value.trim();
  var classList = target.classList;
  if(value &&(
      (name==="component-properties-html" && !value.match(/(.html|.htm)$/)) ||
      (classList.contains("component-css-value") &&
        target.dataset.attributeName === "href"  &&
        !value.endsWith(".css")) ||
      (classList.contains("component-js-value") &&
        target.dataset.attributeName === "src"  &&
        !value.match(/(.js|.mjs)$/))
    )){
    value = target.dataset.value;
  }
  e.target.value = value;
}, true);
componentSettingsForm.addEventListener("keydown", e => {
  if(e.key == "Enter") {
    e.preventDefault();
    e.target.dispatchEvent(new Event("change"));
  }
}, true);
componentSettingsForm.addEventListener("click", e => {
  var target = e.target;
  var classList = target.classList;
  if (classList.contains("component-settings-save"))
    submitSettings();
  if (classList.contains("component-settings-create-html-from-document") ||
    classList.contains("component-settings-create-template-from-document"))
    getHTMLFromDocument(e.target.dataset.index);
  if (classList.contains("get-scripts-from-document"))
    getScriptsFromDocument(e);
  if (classList.contains("get-styles-from-document"))
    getStylesFromDocument(e);
  if (classList.contains("concatenate-sources"))
    concatenateSources(e.target.dataset.type);
  if (classList.contains("minify-source-scripts"))
    minifySourceScripts();
  if (classList.contains("minify-source-stylesheets"))
    minifySourceStylesheets();
  if (classList.contains("get-dependencies-from-document"))
    getDependenciesFromDocument();
  if (classList.contains("svg-link"))
    linkToHTML(e);
  if (classList.contains("edit-component-terser-configuration"))
    editComponentTerserConfiguration(e);
  if(target.id=="settings-component-path-button")
    opener.dispatchEvent(new CustomEvent("project-explorer-highlight-path",{
      detail:{path : target.dataset.path}
    }))
  var dataset = target.dataset;
  if (dataset.addComponentProperty)
    addComponentProperty(dataset.addComponentProperty);
  if (dataset.removeComponentProperty)
    removeComponentProperty(dataset.index, dataset.removeComponentProperty);
});
componentSettings.addEventListener("template-digest", async e => {
  console.log("digest", e);
  var target = e.detail.target;
  var value = target.value;
  var stringModel = e.detail.stringModel;
  var attributeName = target.dataset.attributeName;
  var isCss = target.classList.contains("component-css-value");
  var isHTML = stringModel === "html";
  var conditionToAskForSaveFile = (
    (isHTML && value) ||
    (value && isCss && attributeName === "href") ||
    (value && target.classList.contains("component-js-value") && attributeName === "src")
  )
  if(conditionToAskForSaveFile){
    openerDialog.open("checking resource...");
    var type = isCss ? "css" : isHTML ? "html" : "js";
    var iframePath = settingsModel.__local ? settingsModel.path + "/" : "/";
    var filePath = ((iframePath[0] == "/" ? iframePath : "/" + iframePath) + value)
      .replace(/\/\//g, "/");
    try {
      await app.storageInterface.read(filePath);
      openerDialog.close();
    }
    catch(e){
      try {
        openerDialog.close();
        await createNewFileOnInput(filePath,isHTML ? app.template : "")
      }
      catch(e){
        if(e?.reason!=="user reject")
          alertDialog("error on saving file->:" + e.error || e.err || e.toString(), true)
        var settingsModelString = isHTML ? "html" : "bundle[" + target.dataset.index + "].value";
        var comp = app.localComponentsFlat[settingsModel.name]
        var previousValue = isHTML ? comp.html : comp.bundle[type]?.[attributeName] || "";
        return settingsTT.set(settingsModelString,
          previousValue);
      }
    }
  }
  await submitSettings();
});
opener.addEventListener("html-rendered", e => {
  settingsTT.set("cangetfromdocument", app.core && app.core.currentDocument)
});