async function importingComponents(files, local) {
  var errors = [];
  openerDialog.open("importing components...", true);
  if (files.length) {
    for (var i = 0; i < files.length; i++) {
      try {
        await importComponentAsZip(files[i], local);
      } catch (e) {
        console.error(e);
        errors.push(e)
      }
    }
  }
  if (errors.length) {
    openerDialog.open("Errors in importing components:<br>" + errors.join("<br>"));
  } else openerDialog.open("Import finished");
}

localComponents.addEventListener("change", async e => {
  if(e.target.id != "import-local-components")
    return;
  importingComponents(e.target.files, true);
  e.target.value = "";
},true);
localComponents.addEventListener("dropzone-dropping", async e => {
  importingComponents(e.detail.files, true)
  e.target.value = "";
},true);
globalComponents.addEventListener("change", async e => {
  if(e.target.id != "import-global-components")
    return;
  importingComponents(e.target.files)
  e.target.value = "";
},true);
globalComponents.addEventListener("dropzone-dropping", async e => {
  importingComponents(e.detail.files)
  e.target.value = "";
},true);