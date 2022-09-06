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
      deleteFiles : !isLocal // TODO
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