function historyComparison(__historyFileRecord, redo) {
  __historyFileRecord = redo ? __historyFileRecord.newRecord : __historyFileRecord.oldRecord;
  // __historyFileRecord.path is setted by currentPage, but not in test cases
  if (__historyFileRecord.path) {
    var currentStylePath = decodeURI(tilepieces.core.matchCurrentStyleSheetNode.href).replace(location.origin, "");
    logOnDocument(assert(currentStylePath == __historyFileRecord.path, "currentStylePath == __historyFileRecord.path")
      , "success");
    var currentStyleText = [...tilepieces.core.currentStyleSheet.cssRules].map(v => v.cssText).join("");
    logOnDocument(assert(
        currentStyleText.replace(/(\r\n|\n|\r|\t|\s)/gm, "") == __historyFileRecord.text.replace(/(\r\n|\n|\r|\t|\s)/gm, ""),
        "currentStyleSheet == __historyFileRecord.text")
      , "success");
  } else {
    logOnDocument(assert(compareDocuments({htmltext: __historyFileRecord.text}), "htmlfile == __historyFileRecord.text")
      , "success");
  }
}