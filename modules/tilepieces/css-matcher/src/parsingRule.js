function parsingRule(DOMEl, rule, style, inherited) {
  var selectors = splitCssValue(rule.selectorText);
  var properties = propertiesMap(getCssTextProperties(rule.style.cssText), inherited);
  if (!properties)
    return null;
  var specificity = 0;
  selectors = selectors.map((v, i, a) => {
    var match = DOMEl.matches(v);
    if (match) {
      var spec = cssSpecificity(v);
      if (spec > specificity)
        specificity = spec;
    }
    return {
      match: match,
      string: v,
      selectorText: `${i > 0 ? " " : ""}${v}${i < a.length - 1 ? "," : ""}`
    }
  });
  return {
    rule: rule,
    specificity: specificity,
    selectors: selectors,
    properties: properties,
    inheritedProps: inherited,
    href: style.href,
    type: style.type
  }
}