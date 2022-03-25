function getUnitProperties(d, prop) {
  var declarationMatchInCss = d.cssRules.matchStyle(prop);
  var declaration = declarationMatchInCss ? declarationMatchInCss.value : d.styles[prop];
  var numberValue = declaration ? declaration.match(regexNumbers) : null;
  if (!numberValue)
    return {
      name: prop,
      value: declaration,
      declaration
    };
  else
    return {
      name: prop,
      value: numberValue[0],
      declaration,
      unit: declaration.replace(numberValue, "")
    }
}