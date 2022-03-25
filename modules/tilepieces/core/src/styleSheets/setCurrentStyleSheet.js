TilepiecesCore.prototype.setCurrentStyleSheet = function (node) {
  return new Promise((resolve, reject) => {
    try {
      var $self = this;
      var path = tilepieces.currentPage.path;
      var oldRecord ={path,text:$self.createDocumentText($self.htmlMatch.source)};
      var doc = $self.currentDocument;
      var sourceDoc = $self.htmlMatch.source;
      var oldStyle = $self.currentStyleSheet;
      var oldStyleMatch;
      if (oldStyle && oldStyle == node)
        return;
      if (oldStyle) {
        var currentStyleSheetNode = $self.currentStyleSheet.ownerNode;
        if (currentStyleSheetNode) {
          oldStyleMatch = $self.matchCurrentStyleSheetNode;
          currentStyleSheetNode.removeAttribute(tilepieces.currentStyleSheetAttribute);
          oldStyleMatch.removeAttribute(tilepieces.currentStyleSheetAttribute);
        }
      }
      var newNodeSource = $self.htmlMatch.find(node).match;
      node.setAttribute(tilepieces.currentStyleSheetAttribute, "");
      newNodeSource.setAttribute(tilepieces.currentStyleSheetAttribute, "");
      longPollingStyleSheet(node, () => {
        $self.currentStyleSheet = node.sheet;
        $self.matchCurrentStyleSheetNode = newNodeSource;
        var newRecord = {path, text: $self.createDocumentText($self.htmlMatch.source)};
        $self.setHistory({
          doc,
          sourceDoc,
          $self,
          newNodeSource,
          oldStyle,
          oldStyleEl: oldStyle ? oldStyle.ownerNode : null,
          oldStyleMatch,
          oldSheet: node.sheet,
          node,
          method: "setCurrentStyleSheet",
          __historyFileRecord : {oldRecord, newRecord}
        });
        updateStyles($self);
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  })
};
historyMethods.setCurrentStyleSheet = {
  undo: ho => {
    ho.node.removeAttribute(tilepieces.currentStyleSheetAttribute);
    ho.newNodeSource.removeAttribute(tilepieces.currentStyleSheetAttribute);
    ho.$self.currentStyleSheet = ho.oldStyle ? ho.oldStyle.sheet : null;
    ho.$self.matchCurrentStyleSheetNode = ho.oldStyleMatch ? ho.oldStyleMatch.sheet : null;
    if (ho.oldStyleEl) {
      ho.oldStyleEl.setAttribute(tilepieces.currentStyleSheetAttribute, "");
      ho.oldStyleMatch.setAttribute(tilepieces.currentStyleSheetAttribute, "");
    }
  },
  redo: ho => {
    return new Promise((resolve, reject) => {
      try {
        ho.node.setAttribute(tilepieces.currentStyleSheetAttribute, "");
        ho.newNodeSource.setAttribute(tilepieces.currentStyleSheetAttribute, "");
        if (ho.oldStyleEl) {
          ho.oldStyleEl.removeAttribute(tilepieces.currentStyleSheetAttribute);
          ho.oldStyleMatch.removeAttribute(tilepieces.currentStyleSheetAttribute);
        }
        longPollingStyleSheet(ho.node, () => {
          ho.$self.currentStyleSheet = ho.node.sheet;
          ho.$self.matchCurrentStyleSheetNode = ho.newNodeSource;
          ho.$self.history.entries.forEach(v => {
            if (v.stylesheet === ho.oldSheet)
              v.stylesheet = ho.node.sheet;
          });
          ho.oldSheet = ho.node.sheet;
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    })
  }
}
