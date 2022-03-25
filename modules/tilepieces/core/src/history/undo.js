TilepiecesCore.prototype.undo = async function (dontSave) {
  var $self = this;
  var history = $self.history;
  if (!history.entries.length || history.pointer == 0)
    return;
  var pointer;
  history.pointer--;
  pointer = history.pointer;
  var historyEntry = history.entries[pointer];
  try {
    if (historyEntry.type == "htmltreematch-entry")
      $self.htmlMatch.undo();
    else historyMethods[historyEntry.method].undo(historyEntry);
    !dontSave && await tilepieces.updateFile(
      historyEntry.__historyFileRecord.oldRecord.path,
      historyEntry.__historyFileRecord.oldRecord.text);
    window.dispatchEvent(new Event("tilepieces-core-history-set"));
    window.dispatchEvent(new Event("tilepieces-core-history-change"));
  } catch (e) {
    console.error("[tilepieces-core history]", e);
    console.error("[history]", $self.history);
    $self.history.entries = [];//$self.history.entries.slice(pointer + 1);
    history.stylesheets.splice(1)
    history.documents.splice(1)
    $self.history.pointer = 0;
    window.dispatchEvent(new Event("tilepieces-core-history-error"));
    window.dispatchEvent(new Event("tilepieces-core-history-set"));
    dialog.close();
    alertDialog.open("history error",true);
  }
};