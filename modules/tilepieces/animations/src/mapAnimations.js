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