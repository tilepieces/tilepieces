TilepiecesCore.prototype.selectElement = function (target, match, composedPath = []) {
  var targetToSelect = target.nodeType != 1 ? target.parentNode : target;
  var $self = this;
  if (typeof match === "undefined") {
    match = $self.htmlMatch.find(target)
  }
  if (tilepieces.multiselected &&
    (target.tagName?.match(/HTML|HEAD|BODY/) ||
      !match ||
      tilepieces.multiselections.find(n => n.el.contains(target) || target.contains(n.el)))) {
    console.warn("no match or HTML|HEAD|BODY or el already in multiselection element during multiselection.exit", target);
    return;
  }
  if (!composedPath.length) {
    var swap = target;
    while (swap) {
      composedPath.push(swap);
      swap = swap.parentNode;
    }
  }
  var cssRules = $self.cssMatcher(targetToSelect,
    $self.styles.styleSheets);
  var styles = $self.currentWindow.getComputedStyle(targetToSelect, null);
  var fatherStyle = target.nodeName != "HTML" && targetToSelect.parentNode ?
    $self.currentWindow.getComputedStyle(targetToSelect.parentNode, null) : null;
  var firstRuleMatch = cssRules.cssMatches[1];
  var firstSelector = firstRuleMatch && cssRules.cssMatches[1].rule.selectorText;
  var possibleCssSelector = firstSelector || target.nodeName.toLowerCase() + [...targetToSelect.classList].map(c => "." + c).join("");
  tilepieces.cssSelector = tilepieces.elementSelected == target && tilepieces.cssSelector != possibleCssSelector &&
    cssRules.cssMatches.find(v=>v.rule.selectorText == tilepieces.cssSelector) ? tilepieces.cssSelector : possibleCssSelector;
  var obj = {cssRules, target, styles, fatherStyle, match, composedPath, targetSelected: targetToSelect};
  tilepieces.cssSelectorObj = obj;
  tilepieces.selectorObj = obj;
  tilepieces.elementSelected = target;
  if (tilepieces.multiselected)
    tilepieces.createSelectionClone(target);
  target.tagName == "IMG" &&
  setTimeout(() => {
    tilepieces.editElements.selection.focus();
  });
  //if(target.nodeType==1)
  window.dispatchEvent(
    new CustomEvent("highlight-click", {detail: obj}));
};
