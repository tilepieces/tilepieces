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
