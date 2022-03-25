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