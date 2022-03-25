function drawBox(computed, bound, x, y) {
  var marginDiv = tilepieces.editElements.marginDiv;
  var borderDiv = tilepieces.editElements.borderDiv;
  var paddingDiv = tilepieces.editElements.paddingDiv;
  if (tilepieces.editElements.margin) {
    var marginTop = getPropertyComputed(computed, "margin-top");
    var marginLeft = getPropertyComputed(computed, "margin-left");
    var marginRight = getPropertyComputed(computed, "margin-right");
    var marginBottom = getPropertyComputed(computed, "margin-bottom");
    marginDiv.style.width = bound.width + "px";
    marginDiv.style.height = bound.height + "px";
    marginDiv.style.borderTopWidth = marginTop + "px";
    marginDiv.style.borderLeftWidth = marginLeft + "px";
    marginDiv.style.borderRightWidth = marginRight + "px";
    marginDiv.style.borderBottomWidth = marginBottom + "px";
    var m = `translate(${x - marginLeft}px,${y - marginTop}px)`;
    marginDiv.style.transform = m;
  } else marginDiv.removeAttribute("style");
  var borderTop, borderLeft, borderRight, borderBottom;
  if (tilepieces.editElements.border || tilepieces.editElements.padding) {
    borderTop = getPropertyComputed(computed, "border-top-width");
    borderLeft = getPropertyComputed(computed, "border-left-width");
    borderRight = getPropertyComputed(computed, "border-right-width");
    borderBottom = getPropertyComputed(computed, "border-bottom-width");
  }
  if (tilepieces.editElements.border) {
    borderDiv.style.width = (bound.width - borderRight - borderLeft) + "px";
    borderDiv.style.height = (bound.height - borderBottom - borderTop) + "px";
    borderDiv.style.borderTopWidth = borderTop + "px";
    borderDiv.style.borderLeftWidth = borderLeft + "px";
    borderDiv.style.borderRightWidth = borderRight + "px";
    borderDiv.style.borderBottomWidth = borderBottom + "px";
    borderDiv.style.transform = `translate(${x}px,${y}px)`;
  } else borderDiv.removeAttribute("style");
  if (tilepieces.editElements.padding) {
    var paddingTop = getPropertyComputed(computed, "padding-top");
    var paddingLeft = getPropertyComputed(computed, "padding-left");
    var paddingRight = getPropertyComputed(computed, "padding-right");
    var paddingBottom = getPropertyComputed(computed, "padding-bottom");
    paddingDiv.style.width = (bound.width - paddingLeft - paddingRight) + "px";
    paddingDiv.style.height = (bound.height - paddingTop - paddingBottom) + "px";
    paddingDiv.style.borderTopWidth = paddingTop + "px";
    paddingDiv.style.borderLeftWidth = paddingLeft + "px";
    paddingDiv.style.borderRightWidth = paddingRight + "px";
    paddingDiv.style.borderBottomWidth = paddingBottom + "px";
    paddingDiv.style.transform = `translate(${x}px,${y}px)`;
  } else paddingDiv.removeAttribute("style");
}