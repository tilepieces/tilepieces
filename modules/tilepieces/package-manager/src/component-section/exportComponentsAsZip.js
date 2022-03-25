async function exportComponentsAsZip(componentsToExport, isLocal) {
  // only the first level
  if (!window.JSZip) {
    await import("./../../jszip/jszip.min.js");
  }
  var zip = new JSZip();
  var pkgsExported = [];
  var errors = [];
  var pkgToExport = [];
  for (var i = 0; i < componentsToExport.length; i++) {
    var pkg = componentsToExport[i];
    pkgToExport.push({name:pkg.name,path:"/" + pkg.name});
    openerDialog.open("exporting " + pkg.name + " component...", true);
    pkgsExported = await getComponentAsZip(pkg, zip, pkg.name, isLocal, pkgsExported,pkg.name);
  }
  console.log("pkgsExported -> ", pkgsExported);
  zip.file("tilepieces.components.json", JSON.stringify(pkgToExport,null,2));
  var blobZip = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 1 // FOR DEBUG TODO: CHANGE IT WITH PARAMETERS
      }
    },
    function updateCallback(metadata) {
      openerDialog.open("creating zip: " + metadata.percent + "%", true);
    }
  );
  app.utils.download("tilepieces.components.zip", window.URL.createObjectURL(blobZip));
  var statement = "Zip created";
  if (errors.length) {
    statement += `with errors:
  <details>
      <summary>view errors</summary>
      <ul>
      ${errors.map(e => `<li>${e.error}</li>`).join("")}
      </ul>
  </details>`
  }
  openerDialog.open(statement);
};