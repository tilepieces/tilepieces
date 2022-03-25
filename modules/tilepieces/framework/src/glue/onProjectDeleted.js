window.addEventListener("delete-project", async e => {
  try {
    if (e.detail.name == tilepieces.currentProject) {
      tilepieces.isComponent = null;
      tilepieces.project = null;
      tilepieces.currentProject = null;
      tilepieces.core && tilepieces.core.destroy();
      tilepieces.frame.removeEventListener("load", tilepieces.loadFunction);
      tilepieces.frame.src = "";
      document.title = `Tilepieces`;
      await searchForLastProject();
    } else
      await getSettings();
    dialog.close();
  } catch (e) {
    dialog.close();
    console.error(e);
    return alertDialog("An error occurred while deleting the project. Check the console for more information.",true);
  }
});