function moveW(e, $self) {
  var movePosition = e.x - $self.x;
  $self.x = e.x;
  var width = $self.width - movePosition;
  if (width < 400) {
    document.dispatchEvent(new MouseEvent("mouseup"));
    document.dispatchEvent(new TouchEvent("touchcancel"));
    return;
  }
  $self.width = width;
  var left = $self.left + movePosition;
  $self.left = left > 0 ? left : 0;
  if ($self.left == 0) {
    $self.panelElement.style.transform = "translate(" + $self.left + "px," + $self.top + "px)";
    document.dispatchEvent(new MouseEvent("mouseup"));
    document.dispatchEvent(new TouchEvent("touchcancel"));
    return;
  }
  $self.panelElement.style.width = $self.width + "px";
  $self.panelElement.style.transform = "translate(" + $self.left + "px," + $self.top + "px)";
}