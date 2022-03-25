function setDrag($self, handle, constraint) {
  getBoundingElement($self);
  $self.drag = __dragElement($self.panelElement, {
    handle: handle,
    dragElementConstraint: constraint || function () {
      return false
    },
    preventMouseOut: true,
    grabbingClass: false
  });
  $self.drag.on("down", e => {
    if (!$self.panelElement.classList.contains("panel-element-minimized"))
      $self.preventIframeMousedown.style.display = "block";
  });
  $self.drag.on("move", e => {
    $self.left = e.newX;
    $self.top = e.newY;
  });
  $self.drag.on("up", e => {
    if (!$self.panelElement.classList.contains("panel-element-minimized"))
      $self.preventIframeMousedown.style.display = "none";
  });
}