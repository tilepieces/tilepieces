globalComponents.addEventListener("click", async e => {
  if(!e.target.closest("#export-global-components"))
    return;
  openerDialog.open("exporting components...", true);
  var componentsToExport = [];
  var checkeds = globalComponentsUIMOdel.globalComponents.filter(v => v.checked);
  checkeds.forEach(c =>
    componentsToExport.push(app.globalComponents[c.name]));
  try {
    await exportComponentsAsZip(
      JSON.parse(JSON.stringify(componentsToExport))
    );
  } catch (err) {
    console.error(err);
    openerDialog.open(JSON.stringify(err));
  }
});