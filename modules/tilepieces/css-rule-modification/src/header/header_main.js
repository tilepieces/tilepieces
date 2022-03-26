const opener = window.opener || window.parent;
const tilepieces = opener.tilepieces;
const cssDefaultValues = tilepieces.cssDefaultValues;
const cssDefaultProperties = tilepieces.cssDefaultProperties;

window.cssDefaults = opener.tilepieces.cssDefaultValues;
window.css_rule_modification = o => {
  var t = o.tilepiecesTemplate;
  var m = o.tilepiecesTemplateModel;
  var appView = o.appView;
  var cb = o.cbFunctionOnValueUpdate;
  var autocompleteSingleton = autocomplete(appView);
  appView.addEventListener("click", (e) => {
    if (!e.target.classList.contains("rule-block__add-property"))
      return;
    var ruleEl = e.target.previousElementSibling;//closest(".rule-block__list");
    addProperty(ruleEl, t, m)
  });
  appView.addEventListener("click", activateKey);
  appView.addEventListener("blur", createAutocomplete, true);
  appView.addEventListener("blur", (e) => {
    keyInpuOnBlur(e, t, m);
  }, true);
  appView.addEventListener("input", valueInputOnInput);
  appView.addEventListener("blur", e => {
    if (!e.target.classList.contains("rule-block__value"))
      return;
    updateRuleOnBlur(e.target, t, m, appView, cb);
  }, true);
  appView.addEventListener("paste", e => {
    onPaste(e, autocompleteSingleton, t, m, appView, cb);
  });
  appView.addEventListener("keydown", e => {
    onKeyDown(e, t, m)
  });
  appView.addEventListener("change", e => {
    if (!e.target.classList.contains("rule-block__checked"))
      return;
    checkProperty(e, cb);
  })
};