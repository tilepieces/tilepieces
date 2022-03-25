async function exportProjectsAsZip(projects = []) {
  var projectsPackages = app.projects.filter(p => projects.indexOf(p) > -1).slice(0);
  if (!window.JSZip) {
    await import("./../../jszip/jszip.min.js");
  }
  var zip = new JSZip();
  var errors = [];
  for (var i = 0; i < projectsPackages.length; i++) {
    var pkg = projectsPackages[i];
    openerDialog.open("exporting " + pkg.name + " components...", true);
    var filesToFetch = pkg.files || [""];
    var files = [];
    for (var ftfi = 0; ftfi < filesToFetch.length; ftfi++) {
      try {
        var fetch = await app.storageInterface.search("", filesToFetch[ftfi], null, null, pkg.name);
        files = files.concat(fetch.searchResult);
      } catch (e) {
        errors.push(e)
      }
    }
    console.log("[files]", files);
    for (var fi = 0; fi < files.length; fi++) {
      var f = files[fi];
      var fpath = pkg.name + "/" + f;
      openerDialog.open("exporting file " + f + " from " + pkg.name + " components...", true);
      try {
        var fContent = await app.storageInterface.read(f, null, pkg.name);
        zip.file(fpath, fContent);
      } catch (e) {
        errors.push(e);
      }
    }
    pkg.path = pkg.name;
    delete pkg.components;
    //pkg.components = Object.assign({},pkg.componentsFlat);
    delete pkg.checked;
    delete pkg.localComponents;
    delete pkg.componentsFlat;
  }
  zip.file("tilepieces.projects.json", JSON.stringify(projectsPackages));
  var blobZip = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 1 // FOR DEBUG TODO: CHANGE IT WITH PARAMETERS
      }
    },
    function updateCallback(metadata) {
      openerDialog.open("creating zip: " + metadata.percent + "%", true, true);
    }
  );
  app.utils.download("projects.zip", window.URL.createObjectURL(blobZip));
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
  openerDialog.open(statement, false);
}