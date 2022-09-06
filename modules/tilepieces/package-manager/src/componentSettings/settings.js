componentSettingsForm.addEventListener("change", e => {
  console.log("change form", e);
  //settingsTT.set("disabled","");
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
  var stringModel = e.detail.stringModel;
  if(stringModel == "html"){ // update html file if not exists
    var iframePath = settingsModel.__local ? settingsModel.path + "/" : "/";
    var filePath = ((iframePath[0] == "/" ? iframePath : "/" + iframePath) + settingsModel.html)
      .replace(/\/\//g, "/");
    try {
      await app.storageInterface.read(filePath);
    }
    catch(e){
      try {
        await createNewFileOnInput(filePath,app.template)
      }
      catch(e){
        if(e?.reason!=="user reject")
          alertDialog("error on saving file->:" + e.error || e.err || e.toString(), true)
        return settingsFormActivation(app.isComponent);
      }
    }
  }
  await submitSettings();
});
opener.addEventListener("html-rendered", e => {
  settingsTT.set("cangetfromdocument", app.core && app.core.currentDocument)
});