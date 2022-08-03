TilepiecesCore.prototype.createCurrentStyleSheet = function(cssText) {
  var $self = this;
  var path = tilepieces.currentPage.path;
  var oldRecord ={path,text:$self.createDocumentText($self.htmlMatch.source)};
  var doc = $self.currentDocument;
  var sourceDoc = $self.htmlMatch.source;
  var oldStyle = $self.currentStyleSheet;
  var oldStyleMatch;
  if (oldStyle) {
    var currentStyleSheetNode = $self.currentStyleSheet.ownerNode;
    oldStyleMatch = $self.matchCurrentStyleSheetNode;
    currentStyleSheetNode.removeAttribute(tilepieces.currentStyleSheetAttribute);
    oldStyleMatch.removeAttribute(tilepieces.currentStyleSheetAttribute);
  }
  var newStyle = $self.currentDocument.createElement("style");
  newStyle.innerHTML = cssText;
  $self.currentDocument.head.appendChild(newStyle);
  var newNodeSource = sourceDoc.head.appendChild(newStyle.cloneNode(true));
  newStyle.setAttribute(tilepieces.currentStyleSheetAttribute, "");
  newNodeSource.setAttribute(tilepieces.currentStyleSheetAttribute, "");
  $self.currentStyleSheet = newStyle.sheet;
  $self.matchCurrentStyleSheetNode = newNodeSource;
  var newRecord = {path, text: $self.createDocumentText($self.htmlMatch.source)};
  [...newStyle.sheet.cssRules].forEach(v=>detectNewClass(v.selectorText));
  $self.setHistory({
    doc,
    sourceDoc,
    $self,
    newNodeSource,
    oldStyle,
    oldStyleEl: oldStyle ? oldStyle.ownerNode : null,
    oldStyleMatch,
    newStyle,
    oldSheet: newStyle.sheet,
    method: "createCurrentStyleSheet",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.createCurrentStyleSheet = {
  undo: ho => {
    ho.newStyle.remove();
    ho.newNodeSource.remove();
    ho.$self.currentStyleSheet = ho.oldStyle ? ho.oldStyle.sheet : null;
    ho.$self.matchCurrentStyleSheetNode = ho.oldStyleMatch ? ho.oldStyleMatch.sheet : null;
    if (ho.oldStyleEl) {
      ho.oldStyleEl.setAttribute(tilepieces.currentStyleSheetAttribute, "");
      ho.oldStyleMatch.setAttribute(tilepieces.currentStyleSheetAttribute, "");
    }
  },
  redo: ho => {
    ho.$self.currentDocument.head.appendChild(ho.newStyle);
    ho.sourceDoc.head.appendChild(ho.newNodeSource);
    ho.newStyle.setAttribute(tilepieces.currentStyleSheetAttribute, "");
    ho.newNodeSource.setAttribute(tilepieces.currentStyleSheetAttribute, "");
    ho.$self.currentStyleSheet = ho.newStyle.sheet;
    ho.$self.matchCurrentStyleSheetNode = ho.newNodeSource;
    ho.$self.history.entries.forEach(v => {
      if (v.stylesheet === ho.oldSheet)
        v.stylesheet = ho.newStyle.sheet;
    });
    ho.oldSheet = ho.newStyle.sheet;
    if (ho.oldStyleEl) {
      ho.oldStyleEl.removeAttribute(tilepieces.currentStyleSheetAttribute);
      ho.oldStyleMatch.removeAttribute(tilepieces.currentStyleSheetAttribute);
    }
  }
}
