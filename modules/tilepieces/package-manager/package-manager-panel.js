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
    stylesheet: [],
    script: []
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
componentsDialog.addEventListener("click", e => {
  var target = e.target;
  if (!target.classList.contains("add-new-local-component") ||
    target.closest("#global-components"))
    return;
  var parent = target.dataset.parent;
  var prompt = opener.promptDialog({
    label: "New component name:",
    buttonName: "CREATE",
    checkOnSubmit: true,
    patternFunction: (value, target) => {
      value = value.trim();
      var invalidMatch = value.match(/[/()><?:%*"|\\]+/);
      if (invalidMatch) {
        target.dataset.errormsg = "Component name cannot contain \\/?%*:|\"<> characters";
        return false;
      }
      if (app.localComponents[value]) {
        target.dataset.errormsg = "There's already a component with the same name";
        return false;
      }
      return true;
    },
    onTop: true
  });
  prompt.events.on("submit",async value=>{
  //opener.addEventListener("prompt-dialog-submit", async e => {
    var name = (parent ? parent + "/" : "") + value;
    try {
      var path = "/" + app.componentPath + "/" + name;
      await app.storageInterface.createComponent({
        local: true,
        component: {
          name,
          description: "",
          version: "",
          author: "",
          website: "",
          repository: "",
          html: "",
          bundle: {
            "stylesheet": {},
            "script": {}
          },
          sources: {
            "stylesheets": [],
            "scripts": []
          },
          dependencies: [],
          miscellaneous: [],
          selector: "",
          interface: "",
          path
        }
      });
    } catch (e) {
      console.error("[error on saving component]", e);
      openerDialog.open("error on saving component");
    }
    await app.getSettings();
    localComponentsUITemplate.set("localComponents", turnComponentsToArray(app.localComponents));
  });
});
componentsDialog.addEventListener("click", async e => {
  var target = e.target;
  if (!target.classList.contains("add-new-local-component") || !target.closest("#global-components"))
    return;
  openerDialog.open("importing global component in project...", true, true);
  var bundle = target.__project;
  try {
    var array = await importBundleInComponent(Object.assign({}, bundle));
    for (var i = 0; i < array.length; i++) {
      array[i].name.split("/").length === 1 && await app.storageInterface.createComponent({
        local: true,
        component: array[i]
      });
    }
    await app.getSettings();
    localComponentsUITemplate.set("localComponents", turnComponentsToArray(app.localComponents));
    openerDialog.close();
  } catch (e) {
    console.error(e);
    openerDialog.close();
    opener.alertDialog(e.error || e.err || e.toString(),true);
  }
});
function recorsiveUncheck(components, checked) {
  if(components){
    for(var k in components){
      var c = components[k];
      c.checked = checked;
      recorsiveUncheck(c.components, checked)
    }
  }
}

localComponents.addEventListener("componentsChecked", e => {
  var checked = e.detail.target.checked;
  localComponentsUIMOdel.componentsChecked = checked;
  recorsiveUncheck(localComponentsUIMOdel.localComponents, checked)
  //localComponentsUITemplate.set("", localComponentsUIMOdel);
});
globalComponents.addEventListener("componentsChecked", e => {
  var checked = e.detail.target.checked;
  globalComponentsUIMOdel.componentsChecked = checked;
  //globalComponentsUIMOdel.globalComponents.forEach(v=>v.checked = checked);
  recorsiveUncheck(globalComponentsUIMOdel.globalComponents, checked)
  //globalComponentsUITemplate.set("", globalComponentsUIMOdel);
});

function changeComponentsCheck(e,isGlobal) {
  if (!e.target.classList.contains("package-name"))
    return;
  var checked = e.target.checked;
  var component = e.target.__project;
  component.checked = checked;
  recorsiveUncheck(component.components, checked)
  if(isGlobal)
      return;
  var splitted = component.name.split("/");
  if(splitted.length > 1 && checked){
    var isLocal = localComponents.contains(e.target);
    splitted.pop();
    var startComponents = isLocal ? localComponentsUIMOdel.localComponents : null;
    var start;
    splitted.forEach((v,i,a)=>{
      var name = a.slice(0,i+1).join("/");
      start = startComponents.find(c=>c.name==name);
      start.checked = true;
      startComponents = start.components;
    })
    localComponentsUITemplate.set("", localComponentsUIMOdel);
  }
}

localComponents.addEventListener("change", e => {
  changeComponentsCheck(e);
  localComponentsUITemplate.set("", localComponentsUIMOdel);
});
globalComponents.addEventListener("change", e => {
  changeComponentsCheck(e,true);
  globalComponentsUITemplate.set("", globalComponentsUIMOdel);
});
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
async function exportComponentsAsZip(componentsToExport, isLocal) {
  // only the first level
  if (!window.JSZip) {
    await import("./../../jszip/jszip.min.js");
  }
  var zip = new JSZip();
  var pkgsExported = [];
  var errors = [];
  var pkgToExport = [];
  for (var i = 0; i < componentsToExport.length; i++) {
    var pkg = componentsToExport[i];
    pkgToExport.push({name:pkg.name,path:"/" + pkg.name});
    openerDialog.open("exporting " + pkg.name + " component...", true);
    pkgsExported = await getComponentAsZip(pkg, zip, pkg.name, isLocal, pkgsExported,pkg.name);
  }
  console.log("pkgsExported -> ", pkgsExported);
  zip.file("tilepieces.components.json", JSON.stringify(pkgToExport,null,2));
  var blobZip = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 1 // FOR DEBUG TODO: CHANGE IT WITH PARAMETERS
      }
    },
    function updateCallback(metadata) {
      openerDialog.open("creating zip: " + metadata.percent + "%", true);
    }
  );
  app.utils.download("tilepieces.components.zip", window.URL.createObjectURL(blobZip));
  var statement = "Zip created";
  if (errors.length) {
    statement += `with errors:
  <details>
      <summary>view errors</summary>
      <ul>
      ${errors.map(e => `<li>${e.error}</li>`).join("")}
      </ul>
  </details>`
  }
  openerDialog.open(statement);
};
globalComponents.addEventListener("click", async e => {
  if(!e.target.closest("#export-global-components"))
    return;
  openerDialog.open("exporting components...", true);
  var componentsToExport = [];
  var checkeds = globalComponentsUIMOdel.globalComponents.filter(v => v.checked);
  checkeds.forEach(c =>
    componentsToExport.push(app.globalComponents[c.name]));
  try {
    await exportComponentsAsZip(
      JSON.parse(JSON.stringify(componentsToExport))
    );
  } catch (err) {
    console.error(err);
    openerDialog.open(JSON.stringify(err));
  }
});
localComponents.addEventListener("click", async e => {
  if(!e.target.closest("#export-local-components"))
    return;
  openerDialog.open("exporting components...", true);
  var componentsToExport = [];
  var checkeds = localComponentsUIMOdel.localComponents.filter(v => v.checked);
  checkeds.forEach(c =>componentsToExport.push(app.localComponents[c.name]));
  try {
    await exportComponentsAsZip(
      JSON.parse(JSON.stringify(componentsToExport)), true);
  } catch (err) {
    console.error(err);
    openerDialog.open(JSON.stringify(err));
  }
});
async function getComponentAsZip(pkg, zip, pkgName, isLocal, componentsCache = [],updatePath = "", globalPath = "") {
  if (componentsCache.find(a => a.name == pkg.name))
    return componentsCache;

  var updatepath = (updatePath + "/").replace(/\/+/g, "/");
  var path = isLocal ?
    ((pkg.path || "") + "/").replace(/\/+/g, "/") :
    ((globalPath || "") + "/").replace(/\/+/g, "/");
  var style = pkg.bundle.stylesheet;
  var script = pkg.bundle.script;
  var getSettingsRaw = await app.storageInterface.read(path + "tilepieces.component.json", isLocal ? null : pkgName);
  var settings = JSON.parse(getSettingsRaw);
  pkg.html && zip.file(updatepath + pkg.html,
    await app.storageInterface.read(path + pkg.html, isLocal ? null : pkgName));
  script.src && zip.file(updatepath + script.src,
    await app.storageInterface.read(path + script.src, isLocal ? null : pkgName));
  style.href && zip.file(updatepath + style.href,
    await app.storageInterface.read(path + style.href, isLocal ? null : pkgName));
  pkg.parseHTML && zip.file(updatepath + pkg.parseHTML,
    await app.storageInterface.read(path + pkg.parseHTML, isLocal ? null : pkgName));
  if (pkg.miscellaneous)
    await getComponentGlobArray(pkg.miscellaneous, path, updatepath, zip, isLocal ? null : pkgName);
  pkg.interface && zip.file(updatepath + pkg.interface,
    await app.storageInterface.read(path + pkg.interface, isLocal ? null : pkgName));
  if (pkg.interfaceFiles) {
    await getComponentGlobArray(pkg.interfaceFiles, path, updatepath, zip, isLocal ? null : pkgName);
  }
  if (settings.components) {
    for (var k in settings.components) {
      var cmp = settings.components[k];
      var splitted = cmp.name.split("/");
      if(isLocal){
        var startComponents = localComponentsUIMOdel.localComponents;
        var start;
        splitted.forEach((v,i,a)=>{
          var name = a.slice(0,i+1).join("/");
          start = startComponents.find(c=>c.name==name);
          startComponents = start.components;
        })
        if(start && !start.checked) {
          delete settings.components[k];
          continue;
        }
      }
      openerDialog.open("exporting " + cmp.name + " component...", true);
      componentsCache = await getComponentAsZip(pkg.components[k], zip, pkgName, isLocal, componentsCache,
        (updatepath + "/" + cmp.path).replace(/\/+/g, "/"),
        (globalPath + "/" + cmp.path).replace(/\/+/g, "/"));
    }
  }
  /*
  if (pkg.dependencies) {
    for (var i = 0; i < pkg.dependencies.length; i++) {
      var dep = pkg.dependencies[i];
      if (componentsCache.find(a => a.name == dep))
        continue;
      var alreadyPresent = app.localComponentsFlat[dep];
      if (!alreadyPresent && isLocal)
        throw "Export error:dependency " + dep + " is not present in local library";
      if (!alreadyPresent) {
        var splitDep = dep.split("/");
        if (splitDep.length > 1) {
          var mainDep = splitDep[0];
          alreadyPresent = app.globalComponents[mainDep];
          if (alreadyPresent &&
            !Object.values(alreadyPresent.components).find(v => v.name == dep))
            throw "Export error:dependency " + dep + " is not present in library";
        } else
          alreadyPresent = app.globalComponents[dep];
        if (!alreadyPresent)
          throw "Export error:dependency " + dep + " is not present in library";
        componentsCache = await getComponentAsZip(alreadyPresent, zip, alreadyPresent.name, isLocal, componentsCache);
      }
    }
  }*/
  //pkg.path = "/" + pkg.name.split("/").pop();
  delete settings.path;
  zip.file(updatepath + "tilepieces.component.json", JSON.stringify(settings,null,2));
  componentsCache.push(pkg);
  return componentsCache;
}

async function getComponentGlobArray(globArray, path, updatepath, zip, pkgName) {
  for (var i = 0; i < globArray.length; i++) {
    var iGlob = globArray[i];
    var files = await app.storageInterface.search(path, iGlob, null, pkgName);
    for (var ifo = 0; ifo < files.searchResult.length; ifo++) {
      var file = files.searchResult[ifo];
      var filepath = updatepath + file;
      var fileText = await app.storageInterface.read(path + file, pkgName);
      zip.file(filepath, fileText);
    }
  }
}
async function importBundleInComponent(pkg, array = [], name = "", startPath = "") {
  if (array.find(a => a.name == pkg.name))
    return array;
  if(app.localComponents[pkg.name])
    await app.storageInterface.deleteComponent({
      local: true,
      component: {
        name: pkg.name
      },
      deleteFiles: true
    });
  array.push(pkg);
  var path = (startPath + (pkg.path||"") + "/").replace(/\/+/g,"/");
  var mergeMiscellaneous = pkg.mergeMiscellaneous;
  var miscellaneous = pkg.miscellaneous && pkg.miscellaneous.length ?
    await app.storageInterface.search("",
      name ?
        pkg.miscellaneous.map(v => path + v) :
        pkg.miscellaneous,
      null, name || pkg.name) :
    {searchResult: []};
  let i;
  let m;
  for(i=0;i<miscellaneous.searchResult.length;i++){
    m = miscellaneous.searchResult[i];
    await updateResourceFromComponent(m, name || pkg.name, null, "", mergeMiscellaneous);
  }
  var interfaceFiles = pkg.interfaceFiles && pkg.interfaceFiles.length ?
    await app.storageInterface.search("",
      name ?
        pkg.interfaceFiles.map(v => path + v) :
        pkg.interfaceFiles
      , null, name || pkg.name) :
    {searchResult: []};
  for(i=0;i<interfaceFiles.searchResult.length;i++){
    m = interfaceFiles.searchResult[i];
    await updateResourceFromComponent(m, name || pkg.name, null, "", mergeMiscellaneous);
  }
  // file to import
  var toImport = {
    dependencies: pkg.dependencies || [],
    components: pkg.components || [],
    bundleCss: pkg.bundle.stylesheet.href,
    bundleJs: pkg.bundle.script.src,
    html: pkg.html,
    interface: pkg.interface,
    parseHTML : pkg.parseHTML
  };
  for (var k in toImport) {
    var v = toImport[k];
    if (k == "dependencies") {
      for (i = 0; i < v.length; i++) {
        var dep = v[i].trim();
        if (!dep)
          continue;
        var alreadyPresent = app.localComponentsFlat[dep];
        if (!alreadyPresent) {
          var splitDep = dep.split("/");
          if (splitDep.length > 1) {
            var mainDep = splitDep[0];
            alreadyPresent = app.globalComponents[mainDep];
            if (alreadyPresent &&
              !Object.values(alreadyPresent.components).find(v => v.name == dep))
              throw "Import error:dependency " + dep + " is not present in library";
          } else
            alreadyPresent = app.globalComponents[dep];
          if (!alreadyPresent)
            throw "Import error:dependency " + dep + " is not present in library";
          array = await importBundleInComponent(alreadyPresent, array);
        }
      }
    } else if (k == "components") {
      for (var cName in v) {
        var pkgInner = v[cName];
        if (!pkgInner)
          continue;
        array = await importBundleInComponent(pkgInner, array, name || pkg.name, path);
        array.push(pkgInner);
      }
    } else {
      v && await updateResourceFromComponent(
        v, name || pkg.name, pkg.name, path);
    }
  }
  await updateResourceFromComponent("tilepieces.component.json",name || pkg.name, pkg.name, path);
  //pkg.path = ("/" + app.componentPath + "/" + (name ? name + "/" + pkg.path : pkg.name)).replace(/\/+/g, "/");
  return array;
}
async function searchBlobArrayComponent(array, componentName) {
  var returnArray = [];
  for (var i = 0; i < array.length; i++) {
    var v = array[i];
    var results = await app.storageInterface.search("", v, null, componentName);
    returnArray = returnArray.concat(results.searchResult);
  }
  return returnArray;
}
async function updateResourceFromComponent(toImport,
                                           componentParentName,
                                           componentName,
                                           path = "",
                                           merge = false) {
  if (Array.isArray(toImport)) {
    for (var i = 0; i < toImport.length; i++)
      updateResourceFromComponent(toImport[i], componentParentName, componentName, path)
  } else if (typeof toImport === "string") {
    var pathToImport = path ? path + toImport : toImport;
    var fileText = await app.storageInterface.read(pathToImport, componentParentName);
    var pathToUpdate =
      (merge ? "" : app.componentPath + "/" + componentParentName + "/") +
      (componentName != componentParentName ? pathToImport : toImport);
    await app.storageInterface.update(pathToUpdate.replace(/\/+/g,"/"), new Blob([fileText]));
  }
}
function importComponentAsZip(blobFile, local) {
  return new Promise(async (resolve, reject) => {
    if (!window.JSZip) {
      await import("./../../jszip/jszip.min.js");
    }
    var zip = new JSZip();
    try {
      var contents = await zip.loadAsync(blobFile);
      var componentsData = contents.files["tilepieces.components.json"];
      if (!componentsData)
        throw("no data in zip");
      var components = JSON.parse(await componentsData.async("string"));
      for (var k in components) {
        var comp = components[k];
        var files = {};
        var fileArr = [];
        var path = comp.path[0] == "/" ? comp.path.substring(1) : comp.path;
        zip.folder(path).forEach((relativePath, file) => {
          if (!file.dir)
            files[relativePath] = file;
        });
        for (var f in files) {
          opener.dialog.open("creating "+f+" blob...",true);
          fileArr.push({
            path: f,
            blob: new Blob([await files[f].async("arraybuffer")])
          })
        }
        if (local)
          comp.path = "/" + app.componentPath + "/" + comp.name;
        else
          comp.path = "components/" + comp.name;
        opener.dialog.open("saving files...",true);
        await app.storageInterface.createComponent({
          local,
          component: comp
        }, fileArr);
      }
      await app.getSettings();
      resolve();
    } catch (err) {
      reject(err);
    }
  })
}
async function importingComponents(e, local) {
  var errors = [];
  openerDialog.open("importing components...", true);
  if (e.target.files.length) {
    for (var i = 0; i < e.target.files.length; i++) {
      try {
        await importComponentAsZip(e.target.files[i], local);
      } catch (e) {
        console.error(e);
        errors.push(e)
      }
    }
  }
  if (errors.length) {
    openerDialog.open("Errors in importing components:<br>" + errors.join("<br>"));
  } else openerDialog.open("Import finished");
}

localComponents.addEventListener("change", async e => {
  if(e.target.id != "import-local-components")
    return;
  importingComponents(e, true)
},true);
importGlobalComponents.addEventListener("change", async e => {
  if(e.target.id != "import-global-components")
    return;
  importingComponents(e)
},true);
componentsDialog.addEventListener("click", async e => {
  var target = e.target;
  if (!target.classList.contains("remove-component"))
    return;
  var project = target.__project;
  var isLocal = target.closest("#local-components");
  try {
    await app.storageInterface.deleteComponent({
      local: !!isLocal,
      component: {
        name: project.name
      },
      deleteFiles : !isLocal
    });
  } catch (e) {
    console.error("[error on removing component]", e);
    openerDialog.open("error on removing component");
  }
  await app.getSettings();
  if (isLocal) {
    localComponentsUITemplate.set("localComponents", turnComponentsToArray(app.localComponents));
  } else
    globalComponentsUITemplate.set("globalComponents", turnComponentsToArray(app.globalComponents));
})
componentsDialog.addEventListener("click", async e => {
  var target = e.target;
  if (!e.target.classList.contains("set-component"))
    return;
  var componentSettingsSibling = componentSettings.nextSibling; // is local components...
  var hidden = componentSettings.hidden;
  if (hidden)
    componentSettings.hidden = false;
  UserIsWritingComponentMetadata = true;
  var component = target.__project;
  settingsFormActivation(component, true);
  var d = dialog.open(componentSettings, false, true);
  d.events.on("close", async e => {
    await app.getSettings();
    localComponentsUITemplate.set("localComponents", turnComponentsToArray(app.localComponents));
    componentSettingsSibling.parentNode.insertBefore(componentSettings, componentSettingsSibling);
    settingsFormActivation(app.isComponent);
    if (hidden)
      componentSettings.hidden = true;
    UserIsWritingComponentMetadata = false;
    target.__project = app.localComponentsFlat[component.name];
  });
})
componentsDialog.addEventListener("click", async e => {
  var target = e.target;
  if (!target.classList.contains("set-fixed-HTML"))
    return;
  var component = target.__project;
  await app.utils.setFixedHTMLInProject(component);
});
function turnComponentsToArray(comps, isGlobal) {
  var toArray = [];
  var compsOrdered = Object.keys(comps).sort((a, b) => a.localeCompare(b)).reduce(
    (obj, key) => {
      obj[key] = comps[key];
      return obj;
    },
    {}
  );
  for (var key in compsOrdered) {
    var c = Object.assign({}, compsOrdered[key]);
    var isProjectPackage = c.name == app.project?.name;
    if (isProjectPackage && (isGlobal || !c.components || !Object.keys(c.components).length))
      continue;
    c.noSet = isProjectPackage || isGlobal;
    toArray.push(c);
    if (c.components && !Array.isArray(c.components) && typeof c.components === "object")
      c.components = turnComponentsToArray(c.components, isGlobal);
    else
      c.components = {};
    c.checked = true;
  }
  return toArray
}
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
async function concatenateSources(type, noUpdate) {
  var key1 = type,
    key2 = key1 == "scripts" ? "script" : "stylesheet",
    key3 = key1 == "scripts" ? "js" : "css",
    key4 = key1 == "scripts" ? "src" : "href";
  openerDialog.open(`concatenating ${key1}`, true);
  var nameSplitted = settingsModel.name.split("/");
  var name = settingsModel.name;
  var defaultPath = settingsModel.__local ?
    settingsModel.path + "/" :
    "";
  try {
    var search = await app.storageInterface.search(
      defaultPath, settingsModel.sources[key1].map(v => v.value), null);
    var final = settingsModel.bundle[key2 + "Header"] ?
      settingsModel.bundle[key2 + "Header"] + "\n" : "";
    if (settingsModel.addDependenciesToBundles) {
      var pkg = app.localComponentsFlat[name];
      final += await getDependencies(pkg, key2, key4, key1 == "scripts" ? "\n" : false);
    }
    for (var i = 0; i < search.searchResult.length; i++) {
      var source = search.searchResult[i];
      if (source.match(app.utils.URLIsAbsolute))
        return;
      final += await app.storageInterface.read(defaultPath + source);
      if (key1 == "scripts") final += "\n";
    }
    var bundleNameInCompSettings = settingsModel.bundle[key2] &&
      settingsModel.bundle[key2].find(v => v.name == key4);
    var originalBundleName = bundleNameInCompSettings && bundleNameInCompSettings.value;
    if (originalBundleName && bundleNameInCompSettings.value.startsWith(defaultPath))
      originalBundleName = originalBundleName.replace(defaultPath, "");
    var bundlePath = (originalBundleName &&
        (defaultPath + originalBundleName).replace(/\/\//g, "/")) ||
      (defaultPath + settingsModel.name.replaceAll("/",".") + ".bundle." + key3).replace(/\/\//g, "/");
    /*
    if(!bundleNameInCompSettings || !bundleNameInCompSettings.value ||
        bundleNameInCompSettings.value != bundlePath)
        bundleNameInCompSettings.value = bundlePath*/
  } catch (e) {
    console.error(`[error trying concatenating ${key1}]`, e);
    openerDialog.open(`error trying concatenating ${key1}`);
    return;
  }
  final += settingsModel.bundle[key2 + "Footer"] ?
    "\n" + settingsModel.bundle[key2 + "Footer"] : "";
  if (noUpdate)
    return {final, bundlePath, originalBundleName};
  app.storageInterface.update(bundlePath, new Blob([final])).then(
    res => {
      openerDialog.close();
      if (!originalBundleName) {
        settingsTT.set("bundle." + key2, [{name: key4, value: bundlePath.replace(defaultPath, "")}]);
        submitSettings();
      }

    }, err => {
      console.error(`[error trying updating bundle ${key1} after concatenation]`, err);
      openerDialog.open("updating bundle error");
    }
  )
};
async function editComponentTerserConfiguration(){
  app.codeMirrorEditor(JSON.stringify(settingsModel.terserConfiguration), "json")
    .then(res => {
      if(!res) {
        settingsModel.terserConfiguration = "";
        submitSettings();
        return;
      }
      try{
        settingsModel.terserConfiguration = JSON.parse(res);
        submitSettings();
      }
      catch(e){
        alertDialog("invalid JSON. terserConfiguration setted to <pre><code>" +
          JSON.stringify(settingsModel.terserConfiguration,null,2)
          + "</code></pre>");
      }
    }, e => console.warn(e))
}
async function getDependencies(pkg, bundleType, bundleAttr, separationString) {
  var text = "";
  var dependencies = getDependenciesFlat(pkg);
  for (var di = 0; di < dependencies.length; di++) {
    var depName = dependencies[di].name;
    var dep = app.localComponentsFlat[depName];
    if (!dep)
      throw "dependency '" + depName + "' is not present on local components";
    var depBundle = dep.bundle[bundleType] && dep.bundle[bundleType][bundleAttr];
    if (!depBundle)
      continue;
    var depBundlePath = (dep.path || "") + "/" + depBundle;
    depBundlePath.replace(/(\/\/)/g, "/");
    if (depBundlePath[0] == "/")
      depBundlePath = depBundlePath.substring(1);
    text += await app.storageInterface.read(depBundlePath);
    if (separationString) text += separationString
  }
  return text;
}
function getDependenciesFlat(component, dependenciesFlat = [], startComponent = null) {
  var name = component.name;
  if (component.dependencies) {
    for (var i = component.dependencies.length - 1; i >= 0; i--) {
      var nameDep = component.dependencies[i];
      var pkgDep = app.localComponentsFlat[nameDep];
      if (!pkgDep)
        throw "Dependency '" + nameDep + "' is not present in local components";
      var indexOfPkgDep = dependenciesFlat.indexOf(pkgDep);
      var indexOfMainComp = dependenciesFlat.indexOf(component);
      if (indexOfPkgDep < 0 || indexOfPkgDep > indexOfMainComp) {
        indexOfPkgDep > -1 && dependenciesFlat.splice(indexOfPkgDep, 1);
        dependenciesFlat.unshift(pkgDep);
        dependenciesFlat = getDependenciesFlat(pkgDep, dependenciesFlat, startComponent || component);
      }
    }
  }
  var pkg = app.localComponentsFlat[name];
  startComponent && startComponent.name != name &&
  dependenciesFlat.indexOf(pkg) < 0 &&
  dependenciesFlat.unshift(pkg);
  return dependenciesFlat;
}
function getDependenciesFromDocument(e) {
  var deps =
    [...app.core.htmlMatch.source.querySelectorAll("[" + app.componentAttribute + "]")];
  settingsModel.sources.dependencies = deps.map((v, index) => {
    var depName = v.getAttribute(app.componentAttribute);
    var dep = app.localComponents[depName];
    if (!dep) {
      console.trace();
      throw "error getting dependencies"
    }
    dep.index = index;
    return dep;
  });
  settingsTT.set("", settingsModel);
}
async function getHTMLFromDocument(objectPointerString = "html") {
  var defaultPath = app.htmlDefaultPath.match(/(\\)$|(\/)$/) ? app.htmlDefaultPath : app.htmlDefaultPath + "/";
  var div = document.createElement("div");
  [...app.core.htmlMatch.source.body.childNodes].forEach(v => div.append(v.cloneNode(true)));
  [...div.querySelectorAll("script,link,style")].forEach(v => v.remove());
  var html = settingsTT.getParamFromString(objectPointerString);
  var path = html || (defaultPath + settingsModel.name + ".html");
  try {
    await app.storageInterface.update(path, new Blob([div.innerHTML]));
  } catch (e) {
    console.error("[error in saving component default html]", e);
    openerDialog.open("error in saving component default html");
  }
  settingsTT.set(objectPointerString, path)
}
function linkToHTML(e){
  e.preventDefault();
  var iframePath = settingsModel.__local ? app.utils.paddingURL(settingsModel.path) : "/";
  app.setFrame((iframePath + settingsModel.html).replace(/\/+/g,"/"));
}
function getScriptsFromDocument(e) {
  var scripts =
    [...app.core.htmlMatch.source.querySelectorAll("script[src]")];
  settingsModel.sources.scripts = scripts.map((v, i) => {
    var obj = {};
    obj.attrs = [...v.attributes].map(attr => {
      var obj = {};
      obj.name = attr.nodeName;
      obj.value = attr.nodeValue;
      return obj;
    });
    obj.index = i;
    return obj;
  });
  settingsTT.set("", settingsModel);
}
function getStylesFromDocument(e) {
  var stylesheets =
    [...app.core.htmlMatch.source.querySelectorAll("link[rel=stylesheet]")];
  settingsModel.sources.stylesheets = stylesheets.map((v, i) => {
    var obj = {};
    obj.attrs = [...v.attributes].map(attr => {
      var obj = {};
      obj.name = attr.nodeName;
      obj.value = attr.nodeValue;
      return obj;
    });
    obj.index = i;
    return obj;
  });
  settingsTT.set("", settingsModel);
}
async function minifySourceScripts() {
  openerDialog.open("minifying scripts...", true, true);
  try {
    var {final, bundlePath, originalBundleName} = await concatenateSources("scripts", true);
    if (!window.Terser) {
      await import("./../../terser/terser.bundle.min.js") // https://unpkg.com/terser
    }
  } catch (e) {
    console.error("[error trying concatenating scripts]", e);
    openerDialog.open("concatenating scripts error");
    return;
  }
  try {
    var options =  typeof settingsModel.terserConfiguration === 'object' &&
      !Array.isArray(settingsModel.terserConfiguration) && settingsModel.terserConfiguration || app.terserConfiguration;
    minifyObj = {};
    minifyObj[options.sourceMap ? options.sourceMap.filename : bundlePath] = final;
    var finalMinified = await window.Terser.minify(minifyObj, options);
    if (typeof finalMinified.code !== "string")
      throw "code minification error";
  } catch (e) {
    console.error("[error trying minifing scripts]", e);
    openerDialog.open("concatenating minifing error:\n" + e.toString());
    return;
  }
  try {
    if (options.sourceMap) {
      var path = bundlePath.split("/").filter((v,i,a)=>i!=a.length-1).join("/");
      await app.storageInterface.update((path + "/" + options.sourceMap.filename).replace(/\/+/g,"/"),
        new Blob([final]));
      await app.storageInterface.update((path + "/" + options.sourceMap.url).replace(/\/+/g,"/"),
        new Blob([finalMinified.map]));
    }
    await app.storageInterface.update(bundlePath, new Blob([finalMinified.code]));
    if (!originalBundleName) {
      var defaultPath = settingsModel.__local ?
        settingsModel.path + "/" :
        "";
      settingsTT.set("bundle.scripts", [{name: "src", value: bundlePath.replace(defaultPath, "")}]);
    }
    openerDialog.close()
  } catch (e) {
    console.error("[error minification]", e);
    openerDialog.open("error minification");
  }
};

async function minifySourceStylesheets() {
  openerDialog.open("minifying stylesheets...", true, true);
  try {
    var nameSplitted = settingsModel.name.split("/");
    var defaultPath = settingsModel.__local ? app.componentPath + "/" + settingsModel.name + "/" : "";
    var search = await app.storageInterface.search(
      defaultPath, settingsModel.sources.stylesheets.map(v => v.value), null);
    var fakeDoc = document.implementation.createHTMLDocument("");
    var final = settingsModel.bundle.stylesheetHeader + "\n" || "";
    if (settingsModel.addDependenciesToBundles)
      final += await getDependencies("stylesheet", "href");
    for (var i = 0; i < search.searchResult.length; i++) {
      var source = search.searchResult[i];
      if (source.match(app.utils.URLIsAbsolute))
        return;
      var style = fakeDoc.createElement("style");
      style.innerHTML = await app.storageInterface.read(defaultPath + source);
      fakeDoc.head.appendChild(style);
      final += [...style.sheet.cssRules].map(v =>
        v.cssText.replace(/,\s+/g, ",").replace(/\s+\{\s+/g, "{").replace(/\s+\}\s+/g, "}")
      ).join("").replace(/(\r\n|\n|\r|\t)/gm, "");
    }
  } catch (e) {
    console.error("[error trying concatenating stylesheets]", e);
    openerDialog.open("concatenating stylesheets error");
  }
  final += "\n" + settingsModel.bundle.stylesheetFooter || "";
  var bundleSrc = settingsModel.bundle.stylesheet &&
    settingsModel.bundle.stylesheet.find(v => v.name == "src");
  var originalBundleName = bundleSrc && bundleSrc.value;
  if (originalBundleName && originalBundleName.startsWith(defaultPath))
    originalBundleName = originalBundleName.replace(defaultPath, "");
  var bundlePath = (originalBundleName &&
      (defaultPath + originalBundleName).replace(/\/\//g, "/")) ||
    (defaultPath + nameSplitted[0] + ".bundle.min.css").replace(/\/\//g, "/");
  app.storageInterface.update(bundlePath, new Blob([final])).then(res => {
      if (!bundleSrc)
        settingsTT.set("bundle.scripts", [{name: "src", value: bundlePath}]);
      openerDialog.close()
    }, err => {
      console.error("[error trying updating bundle stylesheets after concatenation]", err);
      openerDialog.open("udating bundle error");
    }
  );

};

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
componentSettingsForm.addEventListener("change", e => {
  console.log("change form", e);
  //settingsTT.set("disabled","");

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
componentSettings.addEventListener("template-digest", e => {
  console.log("digest", e);
  submitSettings();
});
opener.addEventListener("html-rendered", e => {
  settingsTT.set("cangetfromdocument", app.core && app.core.currentDocument)
});
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
newProjectButton.addEventListener("click", e => {
  var prompt = opener.promptDialog({
    label: "New project name:",
    buttonName: "CREATE",
    checkOnSubmit: true,
    patternFunction: (value, target) => {
      value = value.trim();
      return !value.match(/[()\/><?:%*"|\\]+/);
    },
    patternExpl: "Project name cannot contain /\\?%*:|\"<> characters"
  });
  prompt.events.on("submit",value=>createProject(value));
});

async function createProject(projectName) {
  if (app.projects.find(v => v.name == projectName)) {
    openerDialog.open("Project already existing");
    return;
  }
  openerDialog.open("Creating Project...", true);
  try {
    var newProject = await app.storageInterface.create(projectName);
    await app.getSettings();
    app.currentProject = projectName;
    var proj = app.projects.find(v => v.name == projectName);
    if(!proj.lastFileOpened) {
      try {
        var index = await app.storageInterface.read("index.html");
      } catch (e) {
        await app.storageInterface.update("index.html",
          new Blob([`This is file index.html of the ${projectName} project. 
Visit <a href='https://tilepieces.net/tutorials' target="_blank">our video tutorial</a> or 
<a href="https://tilepieces.net/documentation" target="_blank">documentation</a> to know more about tilepieces`]));
      }
      newProject.lastFileOpened = "index.html";
    }
    openerDialog.close();
    opener.dispatchEvent(new CustomEvent('set-project', {
      detail: newProject
    }))
  } catch (e) {
    openerDialog.close();
    console.error("[error in creating project]", e);
    opener.alertDialog("error in creating project: " + projectName);
  }
}
projectsDialog.addEventListener("click", e => {
  if (e.target.hasAttribute("data-remove-project"))
    deleteProject(e.target.__project.name);
});

function deleteProject(projectName) {
  var confirm = opener.confirmDialog("Are you sure you want to delete " + projectName);
  confirm.events.on("confirm",value=>{
    if(!value)
      return;
    openerDialog.open("Deleting '" + projectName + "' project...", true);
    app.storageInterface.delete("", projectName).then(data => {
      //openerDialog.close();
      opener.dispatchEvent(
        new CustomEvent('delete-project', {
          detail: {
            name: projectName,
            data
          }
        })
      )
    }, err => {
      console.error("[error in deleting project]", err);
      openerDialog.close();
      opener.alertDialog("Error in deleting project " + projectName);
    })
  });
}

async function exportProjectsAsZip(projects = []) {
  var projectsPackages = app.projects.filter(p => projects.indexOf(p) > -1).slice(0);
  if (!window.JSZip) {
    await import("./../../jszip/jszip.min.js");
  }
  var zip = new JSZip();
  var errors = [];
  for (var i = 0; i < projectsPackages.length; i++) {
    var pkg = projectsPackages[i];
    openerDialog.open("exporting " + pkg.name + " components...", true);
    var filesToFetch = pkg.files || [""];
    var files = [];
    for (var ftfi = 0; ftfi < filesToFetch.length; ftfi++) {
      try {
        var fetch = await app.storageInterface.search("", filesToFetch[ftfi], null, null, pkg.name);
        files = files.concat(fetch.searchResult);
      } catch (e) {
        errors.push(e)
      }
    }
    console.log("[files]", files);
    for (var fi = 0; fi < files.length; fi++) {
      var f = files[fi];
      var fpath = pkg.name + "/" + f;
      openerDialog.open("exporting file " + f + " from " + pkg.name + " components...", true);
      try {
        var fContent = await app.storageInterface.read(f, null, pkg.name);
        zip.file(fpath, fContent);
      } catch (e) {
        errors.push(e);
      }
    }
    pkg.path = pkg.name;
    delete pkg.components;
    //pkg.components = Object.assign({},pkg.componentsFlat);
    delete pkg.checked;
    delete pkg.localComponents;
    delete pkg.componentsFlat;
  }
  zip.file("tilepieces.projects.json", JSON.stringify(projectsPackages));
  var blobZip = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 1 // FOR DEBUG TODO: CHANGE IT WITH PARAMETERS
      }
    },
    function updateCallback(metadata) {
      openerDialog.open("creating zip: " + metadata.percent + "%", true, true);
    }
  );
  app.utils.download("projects.zip", window.URL.createObjectURL(blobZip));
  var statement = "Zip created";
  if (errors.length) {
    statement += `with errors:
      <details>
          <summary>view errors</summary>
          <ul>
          ${errors.map(e => `<li>${e.error}</li>`).join("")}
          </ul>
      </details>`
  }
  openerDialog.open(statement, false);
}
function importProjectAsZip(blobFile) {
  return new Promise(async (resolve, reject) => {
    if (!window.JSZip) {
      await import("./../../jszip/jszip.min.js");
    }
    var zip = new JSZip();
    try {
      var contents = await zip.loadAsync(blobFile);
      var projectsData = contents.files["tilepieces.projects.json"];
      var projects;
      if (!projectsData) {
        console.warn("zip doesn't contain 'tilepieces.projects.json'");
        var projectName = await app.utils.dialogNameResolver(null, null, "no 'tilepieces.projects.json' found. " +
          "Tilepieces will import the entire zip: Please type the new project name", true );
        projects = [{
          path : "",
          name : projectName
        }]
      }
      else{
        projects = JSON.parse(await projectsData.async("string"));
      }
      for (var i = 0; i < projects.length; i++) {
        var p = projects[i];
        var name = p.name;
        var path = p.path;
        openerDialog.open("importing project '" + name + "'", true);
        await app.storageInterface.create(name);
        await app.getSettings();
        app.updateSettings(name);
        var files = [];
        zip.folder(path).forEach((relativePath, file) => {
          if (!file.dir)
            files.push({relativePath, file})
        });
        for (var f = 0; f < files.length; f++) {
          var file = files[f];
          openerDialog.open("importing project '" + name + "' : " + file.relativePath, true);
          await app.storageInterface.update(file.relativePath, new Blob([await file.file.async("arraybuffer")]));
        }
        delete p.path;
        openerDialog.open("importing project '" + name + "' metadata", true);
        var component;
        if (p.components) {
          for (var icomp = 0; icomp < p.components.length; icomp++) {
            component = p.components[icomp];
            await app.storageInterface.createComponent({local: true, component})
          }

        }
        await app.storageInterface.setSettings({
          projectSettings: p
        });
      }
      opener.dispatchEvent(new CustomEvent('set-project', {
        detail: {name:projects[projects.length-1].name}
      }))
      resolve();
    } catch (err) {
      reject(err);
    }
  })
}
projectsDialog.addEventListener("click", async e => {
  if (!e.target.classList.contains("project-name-open"))
    return;
  var project = e.target.__project;
  console.log("[Open project...]", project);
  openerDialog.open("Open project...", true);
  try {
    var res = await app.storageInterface.create(project.name);
    await app.getSettings();
    opener.dispatchEvent(new CustomEvent('set-project', {
      detail: res
    }));
    openerDialog.close();
  } catch (e) {
    openerDialog.close();
    console.error("[error in reopening project]", e);
    opener.alertDialog("[error in reopening project: " + project);
  }
});
function openSubPackage(projectName, path) {
  openerDialog.open("Creating Project...", true);
  app.storageInterface.create(projectName, path).then(res => {
    openerDialog.close();
    opener.dispatchEvent(new CustomEvent('set-project', {
      detail: res
    }))
  }, e => {
    openerDialog.close();
    console.error("[error in creating project]", e);
    alertDialog("error in creating project: " + projectName);
  })
}

localComponents.addEventListener("click", e => {
  if (!e.target.classList.contains("project-name-open"))
    return;
  var projectName = "@component/" + app.currentProject + "/" + e.target.__project.name;
  var path = e.target.__project.path;
  openSubPackage(projectName, path)
});
globalComponents.addEventListener("click", e => {
  if (!e.target.classList.contains("project-name-open"))
    return;
  var projectName = "@component/" + e.target.__project.name;
  openSubPackage(projectName)
});


let projectsUIMOdel = {
  projectName: app.currentProject,
  projects: app.projects.slice(0).map(v => {
    v.checked = true;
    return v;
  }),
  globalSettings: app.globalSettings,
  project: app.project ? assignModelProject(app.project) : {},
  hiddenattr: app.project ? '' : 'hidden',
  projectsChecked: true
};
let projectsUITemplate = new opener.TT(projectsDialog, projectsUIMOdel);

function updateProjects() {
  projectsUIMOdel = {
    projectName: app.currentProject,
    projects: app.projects.slice(0).map(v => {
      v.checked = projectsUIMOdel.projectsChecked;
      return v;
    }),
    globalSettings: app.globalSettings,
    project: app.project ? assignModelProject(app.project) : {},
    hiddenattr: app.project ? '' : 'hidden',
    projectsChecked: projectsUIMOdel.projectsChecked
  };
  projectsUITemplate.set("", projectsUIMOdel);
}

opener.addEventListener("settings-updated", updateProjects);
opener.addEventListener("project-setted", updateProjects);
projectsDialog.addEventListener("projectsChecked", e => {
  projectsUIMOdel.projectsChecked = e.detail.target.checked;
  projectsUITemplate.set("projects", app.projects.slice(0).map(v => {
    v.checked = projectsUIMOdel.projectsChecked;
    return v;
  }));
});
projectsDialog.addEventListener("click", e => {
  if(e.target.id!="export-projects")
    return;
  try {
    exportProjectsAsZip(projectsUIMOdel.projects.filter(v => v.checked));
  } catch (e) {
    console.log(e);
    openerDialog.open(JSON.stringify(e), false);
  }
});
projectsDialog.addEventListener("change", async e => {
  if(e.target.id!="import-projects")
    return;
  var errors = [];
  openerDialog.open("importing projects...", true);
  if (e.target.files.length) {
    for (var i = 0; i < e.target.files.length; i++) {
      try {
        await importProjectAsZip(e.target.files[i]);
      } catch (e) {
        console.error(e);
        errors.push(e)
      }
    }
  }
  if (errors.length) {
    openerDialog.open("Errors in importing projects:<br>" + errors.join("<br>"));
  } else openerDialog.open("Import finished");
},true);
projectsDialog.addEventListener("template-digest", async e => {
  var detail = e.detail;
  var target = detail.target;
  var isGeneralSettings = generalSettings.contains(target);
  var isCurrentProject = currentProjectData.contains(target);
  if (!isGeneralSettings && !isCurrentProject)
    return;
  var settingName = detail.stringModel.split(".").pop();
  var settingsValue = target.type == "checkbox"
    ? target.checked : target.value;
  if (isCurrentProject) {
    if (target.classList.contains("current-project-data__file-value")) {
      settingName = "files";
      settingsValue = projectsUIMOdel.project.files.map(v => v.value);
    }
    await app.changeSettings(settingName, settingsValue);
  } else
    await app.changeGlobalSettings(settingName, settingsValue);
  await app.getSettings();
});

document.querySelector(".current-project-data__add-files")
  .addEventListener("click", function (e) {
    projectsUIMOdel.project.files.push({value: "", index: projectsUIMOdel.project.files.length});
    projectsUITemplate.set("files", projectsUIMOdel.project.files);
  });
projectsDialog.addEventListener("click", async function (e) {
  if (!e.target.classList.contains("current-project-data__remove-files"))
    return;
  var index = e.target.dataset.index;
  var prFiles = projectsUIMOdel.project.files;
  prFiles.splice(index, 1);
  await app.changeSettings("files", prFiles.map(v => v.value));
  await app.getSettings();
  //projectsUITemplate.set("",projectsUIMOdel);
});
