window.panel = function (panelElement,
                         constraint,
                         openOnShow = false,
                         zIndex = null,
                         handle = ".panel-handler",
                         icon = ".panel-eject",
                         closeIcon = ".panel-close") {
  return new Panel(
    panelElement, constraint, openOnShow, zIndex, handle, icon, closeIcon)
};

function Panel(panelElement,
               constraint,
               openOnShow,
               zIndex,
               handle,
               icon,
               closeIcon) {
  var $self = this;
  $self.panelElement = panelElement;
  $self.windowOpen = null;
  $self.panelElementIframe = panelElement.querySelector("iframe");
  $self.placeholder = document.createComment("iframe src=" + $self.panelElementIframe.dataset.src);
  $self.preventIframeMousedown = panelElement.querySelector(".panel-prevent-iframe-mousedown");
  $self.spanTitle = panelElement.querySelector(".panel-title");
  $self.minimizer = panelElement.querySelector(".panel-minimize");
  var dragConstraint = constraint ? (newX, newY, deltaX, deltaY) => constraint(newX, newY, deltaX, deltaY, $self) : false;
  setDrag($self, handle, dragConstraint);
  $self.setDrag = () => setDrag($self, handle, dragConstraint);
  $self.unsetDrag = () => {
    $self.drag.destroy();
    $self.drag = null;
  };

  function clickProxy(e) {
    $self.onClick();
  };

  function updateTitle(e) {
    if (!$self.spanTitle.textContent.trim())
      $self.spanTitle.textContent = $self.panelElementIframe.contentDocument.title;
    $self.panelElementIframe.contentWindow.addEventListener("mousedown", putOnTop);
  };

  function putOnTop(e) {
    var alreadySelected = document.querySelector(".panel-element-selected");
    if (alreadySelected == $self.panelElement)
      return;
    alreadySelected && alreadySelected.classList.remove("panel-element-selected");
    $self.panelElement.classList.add("panel-element-selected");
  }

  function minimize(e) {
    $self.panelElement.classList.add("panel-element-minimized");
    getBoundingElement($self);
  }

  $self.panelElement.addEventListener("mousedown", putOnTop);
  $self.panelElementIframe.addEventListener("load", updateTitle);
  $self.iconDOM = panelElement.querySelector(icon);
  $self.iconDOM.addEventListener("click", clickProxy);
  $self.closer = panelElement.querySelector(closeIcon);
  $self.closer.addEventListener("click", () => $self.close());
  $self.minimizer && $self.minimizer.addEventListener("click", minimize);
  $self.putOnTop = putOnTop;
  $self.destroy = function () {
    $self.panelElement.removeEventListener("mousedown", putOnTop);
    $self.panelElementIframe.contentDocument.removeEventListener("mousedown", putOnTop);
    $self.iconDOM.removeEventListener("click", clickProxy);
    $self.panelElementIframe.removeEventListener("load", updateTitle);
    $self.drag && $self.drag.destroy();
    $self.drag = null;
  };
  // close window on window beforeunload
  window.addEventListener("unload", e => {
    if ($self.windowOpen)
      $self.windowOpen.close()
  });
  var resizeThrottle;
  window.addEventListener("resize", e => {
    if (!$self.drag)
      return;
    clearTimeout(resizeThrottle);
    resizeThrottle = setTimeout(e => {
      if ($self.left + $self.width > window.innerWidth) {
        var left = window.innerWidth - $self.width;
        $self.left = left > 0 ? left : 0;
        $self.panelElement.style.transform = "translate(" + $self.left + "px," + $self.top + "px)";
      }
      if ($self.top + $self.height > window.innerHeight) {
        var top = window.innerHeight - $self.height;
        $self.top = top > 0 ? top : 0;
        $self.panelElement.style.transform = "translate(" + $self.left + "px," + $self.top + "px)";
      }
    }, 32);
  });
  if (!openOnShow)
    $self.panelElementIframe.parentNode.replaceChild(
      $self.placeholder, $self.panelElementIframe
    );
  else $self.show(true);
  resizable($self);
}
