function matchStyle(styleNamecss, cssMatches, ancestors, noAncestors = false) {
  var found, importantFound;
  for (var i = 0; i < cssMatches.length; i++) {
    var rule = cssMatches[i];
    var cssRule = rule.rule.style;
    if (cssRule[styleNamecss]) {
      if (!found)
        found = {
          rule: cssRule,
          value: cssRule[styleNamecss]
        };
      var property = rule.properties.find(v =>
        v.property == styleNamecss ||
        (shorthandProperties[v.property] && shorthandProperties[v.property].find(v => v == styleNamecss))
      );
      if (property && property.value.match(/!important/i))
        importantFound = {
          rule: cssRule,
          value: cssRule[styleNamecss]
        };
    }
    if (found && importantFound)
      break;
  }
  if (noAncestors)
    return importantFound || found;
  if (!found) {
    for (var k = 0; k < ancestors.length; k++) {
      var ruleAncestor = ancestors[k];
      if (ruleAncestor.ancestorStyle &&
        ruleAncestor.ancestorStyle.rule.style[styleNamecss]) {
        found = {
          rule: ruleAncestor.ancestorStyle.rule,
          value: ruleAncestor.ancestorStyle.rule.style[styleNamecss]
        };
        break;
      }
      if (!ruleAncestor.matches.length)
        continue;
      ruleAncestor.matches.sort((a, b) => b.specificity - a.specificity);
      found = ruleAncestor.matches.find(v => v.rule.style[styleNamecss]);
      if (found) {
        found = {
          rule: found.rule,
          value: found.rule.style[styleNamecss]
        };
        break;
      }
    }
  }
  return importantFound || found;
}