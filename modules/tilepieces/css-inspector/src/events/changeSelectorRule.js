// same in css-matcher\src\findPseudoStates.js
const PSEUDOSTATES = /(:hover|:active|:focus|:focus-within|:visited)(?=$|:|\s|,)/g;
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("rule-selector"))
    return;
  var ruleBlock = e.target.closest(".css-inspector__rule-block");
  if (!ruleBlock.classList.contains("selected") ||
    ruleBlock.classList.contains("css-inspector__rule-block__inherited"))
    return;
  var rule = ruleBlock["__css-viewer-rule"];
  rule.editSelector = true;
  t.set("", model);
  ruleBlock.querySelector(".rule-selector-edit").focus();
});

appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("rule-selector-edit"))
    return;
  var ruleBlock = e.target.closest(".css-inspector__rule-block");
  var rule = ruleBlock["__css-viewer-rule"];
  var el = model.elementPresent;
  var selectorText = e.target.innerText.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "");
  var selectorMatch;
  try {
    selectorMatch = el.matches(selectorText.replace(PSEUDOSTATES, ""));
  } catch (e) {
    selectorMatch = false;
  }
  if (!selectorMatch && !rule.selectorMatch) {
    rule.editSelector = false;
    rule.selectorMatch = true;
  } else if (!selectorMatch) {
    rule.selectorMatch = selectorMatch;
    e.target.focus();
  } else {
    //opener.tilepieces.core.deleteOrChangeCssRule(rule.rule,selectorText+"{"+rule.rule.style.cssText+"}");
    opener.tilepieces.core.setSelectorText(rule.rule, selectorText);
    model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
    return;
  }
  t.set("", model);
}, true);

appView.addEventListener("input", e => {
  if (!e.target.classList.contains("rule-selector-edit"))
    return;
  var ruleBlock = e.target.closest(".css-inspector__rule-block");
  var rule = ruleBlock["__css-viewer-rule"];
  var el = model.elementPresent;
  var selectorText = e.target.innerText.trim().replace(/[\u200B-\u200D\uFEFF\u00A0\r\n]/g, "");
  try {
    rule.selectorMatch = el.matches(selectorText.replace(PSEUDOSTATES, ""));
  } catch (e) {
    rule.selectorMatch = false;
  }
  t.set("", model);
});
appView.addEventListener("keydown", e => {
  if (!e.target.classList.contains("rule-selector-edit"))
    return;
  if(e.key == "Enter") {
    e.preventDefault();
    e.target.blur();
  }
});
appView.addEventListener("paste",e=>{
  var t = e.target;
  if(!t.classList.contains("rule-selector-edit"))
    return;
  e.preventDefault();
  if (e.clipboardData && e.clipboardData.getData) {
    var text = e.clipboardData.getData("text/plain");
    if(text.length){
      var sel, range;
      sel = t.ownerDocument.defaultView.getSelection();
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(t.ownerDocument.createTextNode(text));
      var en = new KeyboardEvent("input", {bubbles : true});
      t.dispatchEvent(en);
    }
  }
});