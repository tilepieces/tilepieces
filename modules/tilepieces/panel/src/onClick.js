Panel.prototype.onClick = function () {
  var $self = this;
  if ($self.panelElement.classList.contains("panel-element-minimized")) {
    //$self.show();
    $self.panelElement.classList.remove("panel-element-minimized");
    getBoundingElement($self);
    return;
  }
  var coords = popupCoords($self.panelElement);
  var hasPopUp = $self.panelElement.dataset.altPopup;
  var newWindow = window.open(hasPopUp || $self.panelElementIframe.src,
    "_blank", "top=" + coords.top + ",left=" + coords.left +
    ",width=" + ($self.panelElement.offsetWidth) +
    ",height=" + ($self.panelElement.offsetHeight));
  newWindow.addEventListener("load", function (e) {
    hasPopUp && createDocInWin($self.panelElementIframe.contentDocument, newWindow.document);
    $self.panelElement.style.display = "none";
    $self.windowOpen = newWindow;
    var newEvent = new CustomEvent("window-popup-open", {
      detail: {
        panelElement: $self.panelElement,
        panelElementIframe: $self.panelElementIframe,
        newWindow
      }
    });
    newWindow.dispatchEvent(newEvent);
    $self.panelElementIframe.contentWindow.dispatchEvent(newEvent);
    window.dispatchEvent(new Event("panel-maximized"));
    // force exit listener
    newWindow.document.addEventListener("keydown",e=>{
      if(e.shiftKey && e.key.toLowerCase()==="q")
        newWindow.close();
    })
    newWindow.focus();
    newWindow.addEventListener("unload", function (e) {
      if (!$self.closingWindow) {
        hasPopUp && resetDocInFrame(newWindow.document, $self.panelElementIframe.contentDocument);
        $self.panelElement.style.display = "flex";
        $self.panelElementIframe.focus();
        $self.panelElementIframe.contentWindow.dispatchEvent(
          new CustomEvent("window-popup-close", {
            detail: {
              panelElement: $self.panelElement,
              panelElementIframe: $self.panelElementIframe,
              newWindow
            }
          }));
        window.dispatchEvent(new Event("panel-os-window-close"))
        newWindow.close();
        newWindow = null;
        $self.windowOpen = null;
      }
      $self.closingWindow = false;
    });
  });
}