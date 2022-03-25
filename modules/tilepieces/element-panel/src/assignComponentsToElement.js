function assignComponentsToElement(el) {
  if ([1].indexOf(el.nodeType) == -1)
    el = el.parentNode;
  var comps = [];
  for (var k in app.localComponentsFlat) {
    var v = app.localComponentsFlat[k];
    var selector = v.selector || `[${app.componentAttribute}="${v.name}"]`;
    if (v.interface && selector && el.matches(selector)) {
      var componentBundle = Object.assign({}, v);
      componentBundle.specificity = cssSpecificity(selector);
      componentBundle.path = v.path;
      comps.push(v)
    }
  }
  return comps.concat(tagComponents.filter(v => el.matches(v.selector)))
    .sort((a, b) => b.specificity - a.specificity)
}