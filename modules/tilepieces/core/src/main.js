let regexNumbers = /[+-]?\d+(?:\.\d+)?/; // https://codereview.stackexchange.com/questions/115885/extract-numbers-from-a-string-javascript
let historyMethods = {};

function TilepiecesCore() {
  var $self = this;
  $self.currentDocument = null;
  $self.styles = [];
  $self.htmlMatch = null;
  $self.history = {
    entries: [],
    pointer: 0,
    documents: [],
    stylesheets: []
  };
  $self.cssMatcher = cssMatcher;
  $self.stylesChangeListeners = [];
  $self.unitConverter = unitConverter;
  $self.getUnitProperties = getUnitProperties;
  $self.styleChanges = {
    listeners: [],
    onChange: (cb, once) => $self.styleChanges.listeners.push({cb, once})
  };
  $self.destroy = () => {
    $self.observer && $self.observer.disconnect();
    if(tilepieces.multiselected){
      tilepieces.destroyMultiselection(true);
    }
    drawSelection && $self.removeSelection();
    if (tilepieces) {
      tilepieces.elementSelected = null;
      tilepieces.core = null;
      tilepieces.fileSelected = {};
      tilepieces.currentPage = null;
    }
  };
  return this;
}

window.tilepiecesCore = function (o) {
  return new TilepiecesCore(o);
}