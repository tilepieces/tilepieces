TilepiecesCore.prototype.init = async function (doc, HTMLText) {
  var $self = this;
  $self.currentDocument = doc;
  $self.currentWindow = doc.defaultView;
  $self.htmlMatch = HTMLTreeMatch(HTMLText, doc);
  $self.styles = await cssMapper(doc, tilepieces.idGenerator, tilepieces.classGenerator);
  var currentStyle = [...doc.querySelectorAll("[data-tilepieces-current-stylesheet]")].pop();
  var currentStyleIsAccesible;
  try {
    currentStyleIsAccesible = currentStyle.sheet.cssRules
  } catch (e) {
  }
  if (currentStyleIsAccesible) {
    var found = $self.htmlMatch.find(currentStyle);
    if (found) {
      $self.currentStyleSheet = currentStyle.sheet;
      $self.matchCurrentStyleSheetNode = found.match;
    }
  }
  $self.history.originalDocument = HTMLText;
  $self.fontAlreadyDeclared = [];
  window.dispatchEvent(new CustomEvent("cssMapper-changed", {detail: $self}));
  $self.idIndex = $self.styles.idIndex;
  $self.classIndex = $self.styles.classIndex;
  findGeneratorIndexes($self);
  $self.htmlMatch.on("history-entry", e => {
    var path = tilepieces.currentPage.path;
    var oldRecordFind = $self.history.entries.slice(0).reverse()
      .find(v=>v.type=="htmltreematch-entry" ||
        v.method?.match(/createCurrentStyleSheet|setCurrentStyleSheet/));
    var oldRecord = oldRecordFind ? oldRecordFind.__historyFileRecord.newRecord : {path,text:$self.history.originalDocument};
    var newDoc = $self.createDocumentText($self.htmlMatch.source);
    var newRecord = {path, text: newDoc};
    $self.setHistory({type: "htmltreematch-entry", pointer: e.pointer, ho: e.historyObject,
      __historyFileRecord : {oldRecord, newRecord}});
  });
  $self.observer = $self.observe(doc);
  $self.cachedProperties = [];
  if (tilepieces.multiselected)
    tilepieces.multiselections = [];
  if (tilepieces.elementSelected)
    tilepieces.elementSelected = null;
  return $self;
};