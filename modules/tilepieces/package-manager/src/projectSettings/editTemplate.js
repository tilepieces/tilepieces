projectsDialog.addEventListener("click", async function (ev) {
  if(!ev.target.classList.contains("edit-project-template"))
      return;
  app.codeMirrorEditor(app.project?.template || "", "html")
    .then(async res => {
      await app.changeSettings("template", res);
      await app.getSettings();
    }, e => console.warn(e))
});