async function importingComponents(e, local) {
  var errors = [];
  openerDialog.open("importing components...", true);
  if (e.target.files.length) {
    for (var i = 0; i < e.target.files.length; i++) {
      try {
        await importComponentAsZip(e.target.files[i], local);
      } catch (e) {
        console.error(e);
        errors.push(e)
      }
    }
  }
  if (errors.length) {
    openerDialog.open("Errors in importing components:<br>" + errors.join("<br>"));
  } else openerDialog.open("Import finished");
  e.target.value = "";
}

localComponents.addEventListener("change", async e => {
  if(e.target.id != "import-local-components")
    return;
  importingComponents(e, true)
},true);
importGlobalComponents.addEventListener("change", async e => {
  if(e.target.id != "import-global-components")
    return;
  importingComponents(e)
},true);