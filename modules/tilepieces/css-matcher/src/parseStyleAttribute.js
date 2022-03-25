function parseStyleAttribute(domEl, isInherited) {
  var properties = [];
  var css = domEl.style.cssText.split(";");
  css.forEach(function (v) {
    if (!v.trim().length) return;
    var prop = v.split(/:(.+)/);
    properties.push({
      property: prop[0].trim(),
      value: prop[1].trim()
    });
  });
  return propertiesMap(properties, isInherited);
}