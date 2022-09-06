componentsDialog.addEventListener("click", e => {
  var target = e.target;
  if (!target.classList.contains("set-fixed-HTML"))
    return;
  var component = target.__project;
  var configDialog = opener.confirmDialog("change this html in every component in project?");
  configDialog.events.on("confirm", ()=> app.utils.setFixedHTMLInProject(component));
});