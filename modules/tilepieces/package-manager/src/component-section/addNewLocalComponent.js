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