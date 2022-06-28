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
  if(!e.target.closest("#export-projects"))
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
  await packageManagerImportProject(e.target.files)
  e.target.value = "";
},true);
projectsDialog.addEventListener("dropzone-dropping", async e => {
  await packageManagerImportProject(e.detail.files)
});

document.getElementById("open-template-dialog").addEventListener("click",e=>{
  app.getTemplatesDialog();
});