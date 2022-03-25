TilepiecesCore.prototype.setHistory = async function (historyObject) {
  var $self = this;
  var history = $self.history;
  var pointer = history.pointer;
  var entries = history.entries;
  if (pointer != entries.length) {
    var lastHtmlTreeMatchEntry;
    for (var i = history.entries.length - 1; i >= 0; i--) {
      if (history.entries[i].type == "htmltreematch-entry") {
        lastHtmlTreeMatchEntry = history.entries[i];
        break;
      }
    }
    if (lastHtmlTreeMatchEntry)
      $self.htmlMatch.history.entries = entries.slice(0, lastHtmlTreeMatchEntry.pointer + 1);
    history.entries = entries.slice(0, pointer);
  }
  history.pointer = history.entries.push(historyObject);
  var newRecord = historyObject.__historyFileRecord.newRecord;
  try {
    await tilepieces.updateFile(newRecord.path, newRecord.text);
  }
  catch(e){
    alertDialog.open("can't save the path "+ newRecord.path,true);
  }
  window.dispatchEvent(new Event("tilepieces-core-history-set"));
};