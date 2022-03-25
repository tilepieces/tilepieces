function popupCoords(offsetEl) {
  offsetEl = offset(offsetEl);
  var t = offsetEl.top;
  var l = offsetEl.left;

  var dualScreenLeft = window.screenLeft;
  var dualScreenTop = window.screenTop;

  return {
    left: (dualScreenLeft + l),
    top: (dualScreenTop + t)
  }
}