function getBoundingElement($self) {
  var el = $self.panelElement;
  var p = el.getBoundingClientRect();
  $self.width = p.width;
  $self.height = p.height;
  var computedStyle = el.ownerDocument.defaultView.getComputedStyle(el, null);
  var matrix = computedStyle.transform;
  var computedTop = computedStyle.top;
  var computedLeft = computedStyle.left;
  $self.topPosition = computedTop != "auto" ? +computedTop.replace("px", "") : 0;
  $self.leftPosition = computedLeft != "auto" ? +computedLeft.replace("px", "") : 0;
  var matrixSplitted = matrix.match(/matrix/) ?
    matrix.replace(/[()]/g, "").split(",").map(n => Number(n)) : [0, 0];
  $self.top = matrix.match(/matrix3d/) ? matrixSplitted[matrixSplitted.length - 3] :
    matrixSplitted[matrixSplitted.length - 1];
  $self.left = matrix.match(/matrix3d/) ? matrixSplitted[matrixSplitted.length - 4] :
    matrixSplitted[matrixSplitted.length - 2];
  $self.x = 0;
  $self.y = 0;
}