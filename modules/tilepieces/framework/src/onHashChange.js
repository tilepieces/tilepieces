window.addEventListener('hashchange', async e=> {
  console.log("[browser hash changed:]",e,location.hash);
  /*
  if(tilepieces.__hashInternalCall){
    console.log("[browser hash expected modification, exit:]",e,location.hash);
    delete tilepieces.__hashInternalCall;
    return;
  }
  var hashes = tilepieces.utils.getHashes();
  var name = hashes.project;
  var pathname = hashes.path;
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
     */
}, false);