TilepiecesCore.prototype.translateHighlight = function (target, el, contentRect) {
  if (!target.ownerDocument || !target.ownerDocument.defaultView) // during page change, this function could be fired before being canceled
    return;
  if ([1, 3].indexOf(target.nodeType) == -1)
    return;
  var bound;
  var frameBound = tilepieces.frame.getBoundingClientRect();
  if (target.nodeType != 1) { // text node
    var range = target.getRootNode().createRange();
    range.selectNode(target);
    bound = range.getBoundingClientRect()
  } else // element node
    bound = target.getBoundingClientRect();
  el.style.width = bound.width + "px";
  el.style.height = bound.height + "px";
  var adjust = el.classList.contains("highlight-selection") ? 1 : 0;// 1 is the border of el (.highlight-selection)
  var x = frameBound.x + bound.x; // tilepieces.frame.offsetLeft doesn't work when frame is resized by screen dimensions
  var y = tilepieces.frame.offsetTop + bound.y;
  el.style.transform = `translate(${x - adjust}px,${y - adjust}px)`;
  el.__target = target;
  // draw box, if setted
  if (target == tilepieces.elementSelected && !target.getBBox) {
    drawBox(tilepieces.selectorObj.styles, bound, x, y)
  }
}