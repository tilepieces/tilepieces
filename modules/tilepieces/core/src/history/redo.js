TilepiecesCore.prototype.redo = async function (dontSave) {
  var $self = this;
  var history = $self.history;
  if (!history.entries.length
    || history.pointer == history.entries.length)
    return;
  var pointer = history.pointer;
  var historyEntry = history.entries[pointer];
  try {
    if (historyEntry.type == "htmltreematch-entry")
      $self.htmlMatch.redo();
    else
      await historyMethods[historyEntry.method].redo(historyEntry, $self);
    history.pointer++;
    !dontSave && await tilepieces.updateFile(
      historyEntry.__historyFileRecord.newRecord.path,
      historyEntry.__historyFileRecord.newRecord.text);
    window.dispatchEvent(new Event("tilepieces-core-history-set"));
    window.dispatchEvent(new Event("tilepieces-core-history-change"));
  } catch (e) {
    console.error("[tilepieces-core history]", e);
    $self.history.entries = $self.history.entries.slice(0, pointer);
    $self.history.pointer = 0;
    window.dispatchEvent(new Event("tilepieces-core-history-error"));
    window.dispatchEvent(new Event("tilepieces-core-history-set"));
    dialog.close();
    alertDialog.open("history error",true);
  }
};