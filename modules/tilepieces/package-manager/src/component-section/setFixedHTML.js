componentsDialog.addEventListener("click", async e => {
  var target = e.target;
  if (!target.classList.contains("set-fixed-HTML"))
    return;
  var component = target.__project;
  await app.utils.setFixedHTMLInProject(component);
});