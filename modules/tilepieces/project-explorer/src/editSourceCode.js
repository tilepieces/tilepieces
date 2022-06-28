editSourceCode.addEventListener("click", e => {
  var selected = pt && pt.selected[0];
  var ext = selected.dataset.file.split('.').pop();
  storageIntegration.read(selected.dataset.path).then(fileText => {
    if(typeof fileText != "string"){
      alertDialog("This file appears not to be a text file and therefore cannot be opened.", true);
      return;
    }
    app.codeMirrorEditor(fileText, ext)
      .then(res => {
        dialog.open("saving file...", true);
        app.updateFile(selected.dataset.path, res, 0).then(() => {
          if (app.currentPage && app.currentPage.path == selected.dataset.path)
            app.frame.contentWindow.location.reload();
          dialog.close();
        })
      }, e => {
        if(e) { // codeMirrorEditor returns undefined when closed without clicking the "done" button
          dialog.close();
          alertDialog(e.error || e.err || e.toString(), true);
          console.error(e)
        }
      })
  }, e => {
    alertDialog(e.error || e.err || e.toString(), true);
    console.error(e)
  });
});