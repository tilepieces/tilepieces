(()=>{
const opener = window.opener || window.parent;
const app = opener.tilepieces;
let d; // cached detail
let selectedAnimation = null;
let selectedKeyframe = null;
window.cssDefaults = app.cssDefaultValues;
const appView = document.getElementById("animations");
let newAnimationButton = appView.querySelector("#new-animation");
/*
let deleteAnimationButton = appView.querySelector("#delete-animation");
let newKeyframeButton=appView.querySelector("#new-keyframe");
let deleteKeyframe=appView.querySelector("#delete-keyframe");
*/
let model = {
  cssDefaultProperties: app.cssDefaultProperties,
  isVisible: false,
  animations: []
};
let t = new opener.TT(appView, model, {
  templates: [{
    name: "css-properties-list",
    el: document.getElementById("css-properties-list").content
  }]
});
css_rule_modification({
  tilepiecesTemplate: t,
  tilepiecesTemplateModel: model,
  appView
});
if (app.elementSelected)
  setTemplate({detail: app.cssSelectorObj});
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
window.debugModel = model;
appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  if (!e.target.dataset.cssProp)
    return;
  if (e.target.dataset.value == e.target.innerText)
    return;
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
appView.addEventListener("css-input-set-text", e => {
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
appView.addEventListener("input", e => {
  var target = e.target;
  if (!target.classList.contains("input-css"))
    return;
  var prop = target.dataset.cssProp;
  if (prop) {
    var value = target.innerText;
    var newSetted = setCss(prop, value);
  }
}, true);
function getProp(name, _default) {
  return model._properties[name] ? model._properties[name].value : (_default || model._styles[name]);
}
function mapAnimations(animationRule, index) {
  var contenteditable = animationRule.parentStyleSheet == app.core.currentStyleSheet ? "contenteditable" : "";
  return {
    name: animationRule.name,
    cssRules: mapKeyframes([...animationRule.cssRules], contenteditable),
    contenteditable,
    show: false,
    rule: animationRule,
    index
  }
}
function mapKeyframes(keyframes, contenteditable = "contenteditable") {
  return keyframes.map((keyframe, kindex) => {
    var isEditable = contenteditable == "contenteditable";
    var properties = opener.getCssTextProperties(keyframe.style.cssText).map((v, i) => {
      v.index = i;
      v.checked = true;
      v.disabled = contenteditable ? "" : "disabled";
      v.contenteditable = contenteditable;
      v.autocomplete_suggestions = window.cssDefaults[v.property] || [];
      return v
    });
    var hasCachedProperties = opener.tilepieces.core.cachedProperties.find(v => v.rule == newRule.rule);
    if (hasCachedProperties) {
      hasCachedProperties.properties.forEach(v => {
        if (properties.find(pr => pr.property == v.property && pr.value == v.value)) {
          var indexCached = hasCachedProperties.properties.findIndex(hc => hc.property == v.property && hc.value == v.value);
          hasCachedProperties.properties.splice(indexCached, 1);
          if (!hasCachedProperties.properties.length) {
            opener.tilepieces.core.cachedProperties.splice(opener.tilepieces.core.cachedProperties.indexOf(hasCachedProperties), 1);
          }
          return;
        }
        v.index = properties.length;
        v.disabled = isEditable ? "" : "disabled";
        v.contenteditable = isEditable && v.checked ? "contenteditable" : "";
        properties.push(v);
      })
    }
    return {
      keyText: keyframe.keyText,
      properties,
      isEditable,
      contenteditable,
      rule: keyframe,
      index: kindex
    }
  }).sort((a, b) => {
    var c1 = a.keyText.match(/\d+/)[0];
    var c2 = b.keyText.match(/\d+/)[0];
    return c1 - c2;
  })
}
function setCss(name, value) {
  var target = model.elementPresent;
  var setCss = app.core.setCss(
    target, name, value, model.selector);
  console.log("setcss", name, value);
  return setCss;
}
function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  d = e ? e.detail : d; // cached detail
  model.elementPresent = d.target;
  model.match = d.match;
  model.isVisible = true;
  model._properties = d.cssRules.properties;
  model._styles = d.styles;
  model.animation = getProp("animation");
  model.animationName = getProp("animation-name");
  model.animationDuration = getProp("animation-duration");
  model.animationTimingFunction = getProp("animation-timing-function");
  model.animationDelay = getProp("animation-delay");
  model.animationIterationCount = getProp("animation-iteration-count");
  model.animationDirection = getProp("animation-direction");
  model.animationFillMode = getProp("animation-fill-mode");
  model.animationPlayState = getProp("animation-play-state");
  model.transition = getProp("transition");
  model.transitionProperty = getProp("transition-property");
  model.transitionDuration = getProp("transition-duration");
  model.transitionTimingFunction = getProp("transition-timing-function");
  model.transitionDelay = getProp("transition-delay");
  model.animations = app.core.styles.animations.slice(0).map(mapAnimations);
  model.deleteRuleDisabled = "animation__disabled";
  t.set("", model);
  inputCss(appView);
}

tilepieces_tabs({
  el : document.getElementById("tab-animations")
});
appView.addEventListener("blur", e => {
  if (e.target.dataset.bind != "animation.name")
    return;
  var ruleBlock = e.target.closest(".animation__rule-block");
  var rule = ruleBlock.__animation;
  try {
    app.core.setRuleName(rule.rule, e.target.innerText);
  } catch (e) {
  }
  rule.name = rule.rule.name;
  t.set("", model);
}, true);
appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("keyframe__rule__selector-name"))
    return;
  var ruleBlock = e.target.closest(".keyframe__rule-block");
  var rule = ruleBlock["__keyframe-rule"];
  var selectorText = e.target.innerText.trim();
  try {
    app.core.setKeyText(rule.rule, selectorText);
  } catch (e) {
  }
  rule.keyText = rule.rule.keyText;
  t.set("", model);
}, true);
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("delete-animation"))
    return;
  var ruleBlock = e.target.closest(".animation__rule-block");
  var rule = ruleBlock.__animation.rule;
  //var parent = rule.parentRule || rule.parentStyleSheet;
  //app.core.deleteCssRule(parent,[...parent.cssRules].indexOf(rule));
  app.core.deleteCssRule(rule);
  var index = +ruleBlock.dataset.index;
  model.animations.splice(index, 1);
  t.set("", model)
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("delete-keyframe"))
    return;
  var ruleBlock = e.target.closest(".animation__rule-block");
  var rule = ruleBlock.__animation;
  app.core.deleteKeyframe(rule.rule, rule.cssRules[+e.target.dataset.index].rule);
  rule.cssRules = mapKeyframes([...rule.rule.cssRules]);
  t.set("", model);
  inputCss(appView);
});
let modalNewAnimation = document.getElementById("modal-new-animation");
let newAnimationForm = document.getElementById("new-animation-form");
let newAnimationError = document.getElementById("new-animation-error");
let newAnimationName = document.getElementById("new-animation-name");
let modalNewAnimationClose = modalNewAnimation.querySelector(".modal-animation-close");
newAnimationButton.addEventListener("click", e => {
  newAnimationForm[0].value = "";
  modalNewAnimation.style.display = "flex";
  newAnimationError.style.display = "none";
  modalNewAnimation.ownerDocument.body.classList.add("modal");
  newAnimationForm[0].focus();
});
modalNewAnimationClose.addEventListener("click", e => {
  modalNewAnimation.style.display = "none";
  modalNewAnimation.ownerDocument.body.classList.remove("modal");
});
newAnimationName.addEventListener("input", e => {
  newAnimationError.style.display = "none";
});
modalNewAnimation.addEventListener("keydown", e => {
  if (e.key == "Escape")
    modalNewAnimationClose.click();
}, true);
newAnimationForm.addEventListener("submit", e => {
  e.preventDefault();
  var value = e.target[0].value.trim();
  if (!value) {
    newAnimationError.style.display = "block";
    return;
  }
  if (model.animations.find(v => v.name == value)) {
    // TODO
    newAnimationError.style.display = "block";
    return;
  }
  if (!app.core.currentStyleSheet) {
    app.core.createCurrentStyleSheet("");
  }
  var newRule;
  try {
    newRule = app.core.insertCssRule(app.core.currentStyleSheet, "@keyframes " + value + "{}");
  } catch (e) {
    newAnimationError.style.display = "block";
    return;
  }
  app.core.appendKeyframe(newRule, "0%{}");
  app.core.appendKeyframe(newRule, "100%{}");
  var newAnimation = app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1];
  app.core.styles.animations.push(newAnimation);
  var newMappedAnimation = mapAnimations(newAnimation, model.animations.length);
  var alreadySel = model.animations.find(a => a.show);
  alreadySel && (alreadySel.show = false);
  newMappedAnimation.show = true;
  model.animations.push(newMappedAnimation);
  t.set("", model);
  modalNewAnimationClose.click();
  var animationKeyframe = appView.querySelector(".animation_keyframe.true");
  appView.ownerDocument.defaultView.scrollTo(0, animationKeyframe.offsetTop);
});
let modalNewKeyframe = document.getElementById("modal-new-keyframe");
let newKeyframeForm = document.getElementById("new-keyframe-form");
let newKeyframeError = document.getElementById("new-keyframe-error");
let newKeyframeName = document.getElementById("new-keyframe-name");
let modalNewKeyframeClose = modalNewKeyframe.querySelector(".modal-animation-close");
let ruleWhereToAppendKeyFrame;
appView.addEventListener("click", e => {
  if (!e.target.closest(".new-keyframe"))
    return;
  newKeyframeForm.value = "";
  var ruleBlock = e.target.closest(".animation__rule-block");
  ruleWhereToAppendKeyFrame = ruleBlock.__animation;
  modalNewKeyframe.style.display = "flex";
  newKeyframeError.style.display = "none";
  modalNewKeyframe.ownerDocument.body.classList.add("modal");
  newKeyframeForm.focus();
});
modalNewKeyframeClose.addEventListener("click", e => {
  modalNewKeyframe.style.display = "none";
  modalNewKeyframe.ownerDocument.body.classList.remove("modal");
});
newKeyframeName.addEventListener("input", e => {
  newKeyframeError.style.display = "none";
});
modalNewKeyframe.addEventListener("keydown", e => {
  if (e.key == "Escape")
    modalNewKeyframeClose.click();
}, true);
newKeyframeForm.addEventListener("submit", e => {
  e.preventDefault();
  var value = e.target[0].value.trim();
  if (!value) {
    newKeyframeError.style.display = "block";
    return;
  }
  try {
    app.core.appendKeyframe(ruleWhereToAppendKeyFrame.rule, value + "%{}");
  } catch (e) {
    newKeyframeError.style.display = "block";
    return;
  }
  ruleWhereToAppendKeyFrame.cssRules = mapKeyframes([...ruleWhereToAppendKeyFrame.rule.cssRules]);
  t.set("", model);
  modalNewKeyframeClose.click();
});
appView.addEventListener("click", e => {
  if (!e.target.closest(".open-animation"))
    return;
  var ruleBlock = e.target.closest(".animation__rule-block");
  var rule = ruleBlock.__animation;
  var toggle = !rule.show;
  model.animations.forEach(v => {
    if (v.show) v.show = !toggle
  });
  rule.show = toggle;
  t.set("", model)
})

})();