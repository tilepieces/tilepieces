async function packageManagerImportProject(files){
  var errors = [];
  openerDialog.open("importing projects...", true);
  if (files.length) {
    for (var i = 0; i < files.length; i++) {
      try {
        await app.utils.importProjectAsZip(files[i]);
      } catch (e) {
        console.error(e);
        errors.push(e)
      }
    }
  }
  if (errors.length) {
    openerDialog.open("Errors in importing projects:<br>" + errors.join("<br>"));
  } else openerDialog.open("Import finished");
}