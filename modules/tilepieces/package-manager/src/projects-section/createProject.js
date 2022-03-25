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