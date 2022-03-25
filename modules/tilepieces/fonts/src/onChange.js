appView.addEventListener("template-digest", ev => {
  var e = ev.detail;
  if (e.target.classList.contains("change-src-type")) {
    console.log(e.target.value);
    return;
  }
  var font = e.target.closest(".font");
  var fontModel = model.fonts[font.dataset.index];
  var rule = fontModel.fontFaceRule;
  var parentStyles = rule.parentRule || rule.parentStyleSheet || app.core.currentStyleSheet;
  fontModel.mapped.src = fontModel.srcResources.map(src => {
    if (src.type == "local")
      return `local(${src.local})`;
    else
      return `url(${src.url})${src.format ? ` format(${src.format})` : ""}`;
  }).join(",");
  var fontIndexRule = -1;
  if (parentStyles) {
    fontIndexRule = [...parentStyles.cssRules].indexOf(rule);
    if (fontIndexRule > -1)
      app.core.deleteCssRule(rule);
  }
  var ffr = fontFaceRule(fontModel);
  var newRule = app.core.insertCssRule(parentStyles, ffr, fontIndexRule > -1 ? fontIndexRule : parentStyles.cssRules.length);
  var fontObj = {mapped: fontModel.mapped, fontFaceRule: newRule, cssText: newRule.cssText};
  var alreadyInFont = app.core.styles.fonts.findIndex(f => f.fontFaceRule == rule);
  if (alreadyInFont > -1)
    app.core.styles.fonts.splice(alreadyInFont, 1, fontObj);
  else
    app.core.styles.fonts.push(fontObj);
  assignModel({detail: app.core});
}, true);

appView.addEventListener("click", e => {
  var target = e.target;
  var font = target.closest(".font");
  if (target.classList.contains("add-src")) {
    var srcResources = model.fonts[font.dataset.index].srcResources.splice(0);
    srcResources.push({url: "", format: "", local: "", type: "url"});
    srcResources = srcResources.map((v, i) => {
      v.index = i;
      return v;
    });
    t.set("fonts[" + font.dataset.index + "].srcResources", srcResources);
  }
  if (target.classList.contains("remove-src")) {
    var srcResources = model.fonts[font.dataset.index].srcResources.splice(0);
    srcResources.splice(Number(target.dataset.indexSrc), 1);

    t.set("fonts[" + font.dataset.index + "].srcResources", srcResources);
    var fontFamilyInputToTrigger = font.querySelector(".font-family");
    fontFamilyInputToTrigger.dispatchEvent(new Event("change"))
  }
  if (target.classList.contains("remove-font")) {
    var ffr = model.fonts[font.dataset.index].fontFaceRule;
    app.core.deleteCssRule(ffr);
    assignModel({detail: app.core});
  }
})