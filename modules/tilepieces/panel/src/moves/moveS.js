function moveS(e, $self) {
  if (e.y >= window.innerHeight) {
    document.dispatchEvent(new MouseEvent("mouseup"));
    document.dispatchEvent(new TouchEvent("touchcancel"));
    return;
  }
  var movePosition = e.y - $self.y;
  $self.y = e.y;
  var height = $self.height + movePosition;
  if (height < 30)
    return;
  $self.height = height;
  $self.panelElement.style.height = $self.height + "px";
}