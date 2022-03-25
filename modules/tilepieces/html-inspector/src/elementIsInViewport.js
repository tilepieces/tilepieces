function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  var win = el.ownerDocument.defaultView;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= win.innerHeight &&
    rect.right <= win.innerWidth
  );
}