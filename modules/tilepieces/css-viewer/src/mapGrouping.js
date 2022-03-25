function mapGrouping(grules) {
  var currentStyle = app.core.currentStyleSheet;
  return grules.reduce((filtered, option) => {
    if (option.rule.parentStyleSheet != currentStyle)
      return filtered;
    var type = option.rule.type;
    var isMatch = type == window.CSSRule.SUPPORTS_RULE
      ? app.core.currentWindow.CSS.supports(option.rule.conditionText)
      : type == window.CSSRule.MEDIA_RULE
        ? app.core.currentWindow.matchMedia(option.rule.conditionText).matches
        : null;
    if (!isMatch)
      return filtered;
    var parentRule = option.rule.parentRule;
    while (parentRule) {
      isMatch = parentRule.type == window.CSSRule.SUPPORTS_RULE
        ? app.core.currentWindow.CSS.supports(parentRule.conditionText)
        : parentRule.type == window.CSSRule.MEDIA_RULE
          ? app.core.currentWindow.matchMedia(parentRule.conditionText).matches
          : null;
      if (!isMatch)
        return filtered;
      parentRule = parentRule.parentRule;
    }
    option.isCurrentGr = app.core.currentMediaRule == option.rule;
    option.index = filtered.length;
    filtered.push(option);
    return filtered;
  }, []);
}