// local
let localComponentsUIMOdel = {
  localComponents: turnComponentsToArray(app.localComponents),
  projectName: app.currentProject,
  isComponent: app.isComponent,
  componentsChecked: true
};
let localComponentsUITemplate = new opener.TT(localComponents, localComponentsUIMOdel, {
  templates: [{
    name: "project-component-UI",
    el: document.getElementById("project-component-UI").content
  }, {
    name: "component-buttons",
    el: document.getElementById("component-buttons").content
  }]
});

function updateAll() {
  localComponentsUIMOdel = {
    localComponents: turnComponentsToArray(app.localComponents),
    projectName: app.currentProject,
    isComponent: app.isComponent,
    componentsChecked: localComponentsUIMOdel.componentsChecked
  };
  localComponentsUITemplate.set("", localComponentsUIMOdel);
  if (!UserIsWritingComponentMetadata) { // we are not working on component settings
    if (app.isComponent)
      settingsFormActivation(app.isComponent);
    else {
      settingsModel = JSON.parse(JSON.stringify(componentSettingsModel));
      settingsTT.set("", settingsModel);
    }
  }
  globalComponentsUIMOdel = {
    globalComponents: turnComponentsToArray(app.globalComponents, true),
    componentsChecked: globalComponentsUIMOdel.componentsChecked
  };
  globalComponentsUITemplate.set("", globalComponentsUIMOdel);
}

opener.addEventListener("settings-updated", updateAll);
opener.addEventListener("project-setted", updateAll);
// global
let globalComponentsUIMOdel = {
  globalComponents: turnComponentsToArray(app.globalComponents, true),
  componentsChecked: true
};
let globalComponentsUITemplate = new opener.TT(globalComponents, globalComponentsUIMOdel, {
  templates: [{
    name: "project-component-UI",
    el: document.getElementById("project-component-UI").content
  }, {
    name: "component-buttons",
    el: document.getElementById("component-buttons").content
  }]
});
settingsFormActivation(app.isComponent);
projectsInnerTemplates = [];