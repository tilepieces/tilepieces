const opener = window.opener || window.parent;
const app = opener.tilepieces;
const openerDialog = opener.dialog;
const alertDialog = opener.alertDialog;
const componentSettings = document.getElementById("component-settings");
const componentSettingsForm = document.getElementById("component-settings-form");
const componentButtonCreate = document.getElementById("component-settings-create");
const localComponents = document.getElementById("local-components");
const globalComponents = document.getElementById("global-components");

let exportGlobalComponents = document.getElementById("export-global-components");
let exportLocalComponents = document.getElementById("export-local-components")
let importLocalComponents = document.getElementById("import-local-components");
let importGlobalComponents = document.getElementById("import-global-components")

const menuBarprojects = document.getElementById("menu-bar-projects");
const projectsDialog = document.getElementById("projects");
const currentProjectData = document.getElementById("current-project-data");
const generalSettings = document.getElementById("general-settings");
const newProjectButton = document.getElementById("new-project");
const projectList = document.getElementById("projects-list");

const menuBarcomponents = document.getElementById("menu-bar-components");
const componentsDialog = document.getElementById("components");
let projectsInnerTemplates = [];
const projectComponentUI = document.getElementById("project-component-UI");
let componentSettingsModel = {
  __project : app.project,
  html: "",
  disabled: "disabled",
  name: "",
  iscomponent: "hidden",
  templates: [],
  bundle: {
    stylesheet: [{
      name : "href",
      value : ""
    }],
    script: [{
      name : "src",
      value : ""
    }]
  },
  sources: {
    scripts: [],
    stylesheets: []
  },
  components: {},
  miscellaneous: [],
  version: "1.0.0",
  interface: "",
  selector: "",
  author: "",
  website: "",
  dependencies: [],
  description: "",
  repository: "",
  parseHTML: ""
};
let settingsModel = JSON.parse(JSON.stringify(componentSettingsModel));
let settingsTT = new opener.TT(componentSettings, settingsModel);

let UserIsWritingComponentMetadata;

tilepieces_tabs({
  el: document.getElementById("tabs")
})