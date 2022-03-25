
window.addEventListener("popstate", async e => {
  var s = e.state;
  console.log("[browser history state on popstate:]",s,e);
if(s && s.project) {
  var name = s.project.name;
  var pathname = s.pathname;
  if (name != tilepieces.project.name) {
    dialog.open("Opening Project...", true);
    try {
      await storageInterface.create(name);
      dialog.close();
      await tilepieces.getSettings();
      window.dispatchEvent(new CustomEvent('set-project', {
        detail: tilepieces.projects.find(v=>v.name == name)
      }))
    } catch (e) {
      dialog.close();
      console.error("[error in Opening project]", e);
      alertDialog("error in creating project: " + name,true);
      return;
    }
  }
}
})

