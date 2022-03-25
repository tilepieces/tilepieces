buttonAddFile.addEventListener("change", async e => {
  if (pt && pt.selected[0] && pt.selected[0].hasAttribute("data-dir")) {
    var path = pt.selected[0].dataset.path;
    if (e.target.files.length)
      for (var i = 0; i < e.target.files.length; i++) {
        var fileName = e.target.files[i].name;
        var newPath = path + "/" + fileName;
        try {
          var up = await storageIntegration.update(
            newPath,
            e.target.files[i]
          );
        } catch (e) {
          console.error("[error in adding files]", e);
          alertDialog("Error in adding file " + fileName + "in path " + newPath);
          return;
        }
      }
    /*
    try {
        var read = await storageIntegration.read(path);
    }
    catch(e){
        console.error("[error in reading files after adding files]",e);
        alertDialog("Error in reading file in  " + path + " after adding files");
        return;
    }
    pt.update(pt.selected[0],read.value);*/
  }
})
