function updateTemplateOnNewRule(newRule) {
  d.cssRules = opener.tilepieces.core.cssMatcher(model.elementPresent,
    opener.tilepieces.core.styles.styleSheets);
  setTemplate();
  // HIGHLIGHT new rule
  newRule = newRule || opener.tilepieces.core.currentMediaRule?.cssRules[0] || opener.tilepieces.core.currentStyleSheet.cssRules[0];
  var block;
  if(d.cssRules.cssMatches.find(v=>v.rule == newRule)){
    model.showPseudoStates && togglePseudoStates.click();
    model.showPseudoElements && togglePseudoElements.click();
    block = [...mainRules.querySelectorAll(".css-inspector__rule-block")].find(v=>v["__css-viewer-rule"].rule == newRule);
  }
  else if(d.cssRules.pseudoStates.find(v=>v.rule == newRule)){
    !model.showPseudoStates && togglePseudoStates.click();
    block = [...pseudoStates.querySelectorAll(".css-inspector__rule-block")].find(v=>v["__css-viewer-rule"].rule == newRule);
  }
  else if(d.cssRules.pseudoElements.find(v=>v.rule == newRule)){
    !model.showPseudoElements && togglePseudoElements.click();
    block = [...pseudoElements.querySelectorAll(".css-inspector__rule-block")].find(v=>v["__css-viewer-rule"].rule == newRule);
  }
  var win = mainRules.getRootNode().defaultView;
  var scrollTo = block.offsetTop + (block.offsetHeight / 2 ) + win.scrollY - (win.innerHeight / 2);
  win.scroll({
    top: block.offsetTop - (77 + 28),//(scrollTo - win.scrollY)>=(77 + 28) ? scrollTo : 77 + 28,
    left: 0,
    behavior: 'smooth'
  });
}