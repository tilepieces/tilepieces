function conditionalMap(rule) {
  var conditionText = rule.cssText.split("{")[0].trim();
  var inheritedConditionText = "";
  var parentRule = rule.parentRule;
  while (parentRule) {
    inheritedConditionText = (inheritedConditionText ? inheritedConditionText + ", " : "") +
      parentRule.cssText.split("{")[0].trim();
    parentRule = parentRule.parentRule;
  }
  return {conditionText, inheritedConditionText, rule}
}

window.conditionalRuleMap = conditionalMap;