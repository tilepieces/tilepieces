export function preparation(e, cWin, cDoc, tilepieces) {
  logOnDocument("Preparation", "larger");
  // event return the current page Document element, the same on tilepieces.core.currentDocument
  logOnDocument(assert(e.detail.htmlDocument == tilepieces.core.currentDocument, "e.detail.htmlDocument == tilepieces.core.currentDocument on html-rendered event"), "success")
  var tilepiecesDialog = cDoc.getElementById("tilepieces-dialog");
  var dialogContent = tilepiecesDialog.querySelector(".tilepieces-dialog-content");
  // we expect a dialog with "no storageInterface" text
  /*
    logOnDocument(assert(
        tilepiecesDialog.classList.contains("open") &&
        dialogContent.textContent == "no storageInterface"
        , "tilepiecesDialog is opened, with no storageInterface"), "success");
    tilepiecesDialog.querySelector(".tilepieces-dialog-close").click();
    // we expect to close it
    logOnDocument(assert(
        !tilepiecesDialog.classList.contains("open")
        , "tilepiecesDialog has been successfully closed"), "success");*/
}