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
}

importLocalComponents.addEventListener("change", async e => {
  importingComponents(e, true)
});
importGlobalComponents.addEventListener("change", async e => {
  importingComponents(e)
});