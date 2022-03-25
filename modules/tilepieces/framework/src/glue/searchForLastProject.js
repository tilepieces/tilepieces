async function searchForLastProject() {
  if (!tilepieces?.storageInterface?.getSettings) {
    console.error("[tilepieces] no storage interface on " + window.location.href);
    return;
  }
  dialog.open("initializing...", true);
  try {
    await getSettings();
  } catch (e) {
    console.error(e);
    dialog.close();
    alertDialog(e.err || e.error || e.toString(), true);
    return e;
  }
  var searchParams = new URLSearchParams(location.search);
  var projectSearchParam = searchParams.get('project');
  var path = searchParams.get('path');
  if(!path?.match(/(.html)|(.htm)$/)) // ignore not html files
    path = "";
  if(path) {
    path = decodeURIComponent(path)
    path = path[0] == "/" ? path : "/" + path;
  }
  dialog.open("Creating Project...", true);
  var searchProject = projectSearchParam &&  Array.isArray(tilepieces.projects) &&
    tilepieces.projects.find(v=>v.name == projectSearchParam);
  if(!searchProject)
      path = null;
  var lastProject = searchProject ? {name: projectSearchParam} : Array.isArray(tilepieces.projects) && tilepieces.projects[0];
  if (lastProject) {
    createProject(lastProject.name,path);
  } else {
    dialog.close();
    tilepieces.setFrame("");
  }
}