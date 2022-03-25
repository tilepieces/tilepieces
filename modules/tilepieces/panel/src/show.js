Panel.prototype.show = function (target) {
  var $self = this;
  if (!$self.windowOpen) {
    if ($self.panelElement.style.display != "flex" ||
      $self.panelElement.classList.contains("panel-element-minimized")) {
      $self.placeholder.parentNode && $self.placeholder.parentNode.replaceChild(
        $self.panelElementIframe, $self.placeholder
      );
      $self.panelElement.style.display = "flex";
      $self.panelElementIframe.onload = function (e) {
        window.dispatchEvent(
          new CustomEvent("panel-created-iframe", {
            detail: $self.panelElementIframe
          })
        );
      };
      $self.panelElementIframe.src = $self.panelElementIframe.dataset.src;
      getBoundingElement($self);
    }
    if (target)
      $self.putOnTop({detail: {target}});
  } else {
    if (target) {
      var targetCoords = popupCoords(target);
      $self.windowOpen.moveTo(targetCoords.left, targetCoords.top);
    }
    $self.windowOpen.focus();
  }
}