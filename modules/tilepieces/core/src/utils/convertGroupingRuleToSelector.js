function convertGroupingRuleToSelector(selector, rule) {
  var header = rule.type == window.CSSRule.SUPPORTS_RULE
    ? "@supports" : "@media";
  selector = `${header} ${rule.conditionText}{${selector}{}}`;
  var swapRule = rule;
  while (swapRule.parentRule) {
    header = swapRule.parentRule.type == window.CSSRule.SUPPORTS_RULE
      ? "@supports" : "@media";
    selector = header + " " + swapRule.parentRule.conditionText + "{" + selector + "}";
    swapRule = swapRule.parentRule;
  }
  return selector;
}