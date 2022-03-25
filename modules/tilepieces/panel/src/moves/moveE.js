function moveE(e, $self) {
  if (e.x >= window.innerWidth) {
    document.dispatchEvent(new MouseEvent("mouseup"));
    document.dispatchEvent(new TouchEvent("touchcancel"));
    return;
  }
  var movePosition = e.x - $self.x;
  $self.x = e.x;
  var width = $self.width + movePosition;
  if (width < 400) {
    document.dispatchEvent(new MouseEvent("mouseup"));
    document.dispatchEvent(new TouchEvent("touchcancel"));
    return;
  }
  $self.width = width;
  $self.panelElement.style.width = $self.width + "px";
}