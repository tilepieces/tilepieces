localComponents.addEventListener("click", async e => {
  if(!e.target.closest("#export-local-components"))
    return;
  openerDialog.open("exporting components...", true);
  var componentsToExport = [];
  var checkeds = localComponentsUIMOdel.localComponents.filter(v => v.checked);
  checkeds.forEach(c =>componentsToExport.push(app.localComponents[c.name]));
  try {
    await exportComponentsAsZip(
      JSON.parse(JSON.stringify(componentsToExport)), true);
  } catch (err) {
    console.error(err);
    openerDialog.open(JSON.stringify(err));
  }
});