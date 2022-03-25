TilepiecesCore.prototype.observe = function (targetNode) {
  var $self = this;
  var observerOptions = {
    childList: true,
    attributes: true,
    subtree: true,
    characterData: true
  };

  function callback(mutationList, observer) {
    observeStyleSheets(mutationList, $self);
    window.dispatchEvent(new CustomEvent("tilepieces-mutation-event", {
      detail: {
        mutationList
      }
    }));
    if(tilepieces.multiselected) {
      tilepieces.multiselections.slice(0).forEach((v, i) => {
        if (!tilepieces.core.currentDocument.documentElement.contains(v.el))
          tilepieces.removeItemSelected(i)
      })
    }
    var isElementSelectedRemoved = tilepieces.elementSelected &&
      !tilepieces.core.currentDocument.documentElement.contains(tilepieces.elementSelected);
    isElementSelectedRemoved && tilepieces.core.deselectElement();
  }

  var observer = new MutationObserver(callback);
  observer.observe(targetNode, observerOptions);
  return observer;
}