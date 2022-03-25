function getDimension(el, cssString, property = "width") {
  var old = el.style.getPropertyValue(property);
  var win = el.ownerDocument.defaultView;
  el.style.setProperty(property, cssString, "important");
  var px = +(win.getComputedStyle(el, null)[property].replace("px", ""));
  el.style.setProperty(property, old);
  return px;
}