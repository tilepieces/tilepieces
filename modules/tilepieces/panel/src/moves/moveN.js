function moveN(e, $self) {
  var movePosition = $self.y - e.y;
  $self.y = e.y;
  var height = $self.height + movePosition;
  if (height < 30)
    return;
  $self.height = height;
  var top = $self.top - movePosition;
  $self.top = top > 0 ? top : 0;
  if ($self.top == 0) {
    $self.panelElement.style.transform = "translate(" + $self.left + "px," + $self.top + "px)";
    document.dispatchEvent(new MouseEvent("mouseup"));
    document.dispatchEvent(new TouchEvent("touchcancel"));
    return;
  }
  $self.panelElement.style.height = $self.height + "px";
  $self.panelElement.style.transform = "translate(" + $self.left + "px," + $self.top + "px)";
}