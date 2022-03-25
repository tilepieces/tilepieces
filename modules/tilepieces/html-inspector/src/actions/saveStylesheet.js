function saveStylesheet(){
  var configDialog = opener.confirmDialog(`This action will save the stylesheet in the version parsed and compiled by the browser.
This means that comments and properties not recognized by this browser will be deleted.
Property values can be changed.
Also, if this stylesheet contains rules that have been previously edited, manipulating the document history could result in errors or unexpected changes.
Continue?`);
  configDialog.events.on("confirm",()=>{
    app.core.saveStyleSheet();
  });
}