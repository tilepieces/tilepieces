// Get document-relative position by adding viewport scroll to viewport-relative gBCR
// From jQuery.fn.extend( {offset});
// https://code.jquery.com/jquery-3.5.0.js
// https://api.jquery.com/offset/
function offset(target){
  var rect = target.getBoundingClientRect();
  var win = target.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset
  };
}