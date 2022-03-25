Panel.prototype.close = function (e) {
  var $self = this;
  if ($self.windowOpen) {
    $self.closingWindow = true;
    $self.windowOpen.close();
    $self.windowOpen = null;
  }
  var display = $self.panelElement.style.display;
  if(!display || display == "none")
    return;
  $self.panelElement.style.display = "none";
  if ($self.panelElement.classList.contains("panel-element-selected"))
    $self.panelElement.classList.remove("panel-element-selected");
  $self.panelElementIframe.src = "";
  $self.panelElementIframe.parentNode.replaceChild(
    $self.placeholder, $self.panelElementIframe
  );
  window.dispatchEvent(new CustomEvent("panel-close", {detail: $self}));
}