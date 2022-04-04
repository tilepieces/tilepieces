(()=>{
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
function createDocInWin(doc, targetDocument) {
  var newChilds = [];
  //var styles = doc.querySelectorAll("head link[rel=stylesheet],head style");
  //var newStyles = [...styles].map(v=>v.cloneNode(true));
  for (var i = 0; i < doc.body.childNodes.length; i++) {
    var child = doc.body.childNodes[i];
    if (child.tagName == "SCRIPT")
      continue;
    newChilds.push(child)
  }
  //newStyles.forEach(newStyle=>targetDocument.head.appendChild(newStyle));
  newChilds.forEach(c => {
    targetDocument.adoptNode(c);
    targetDocument.body.appendChild(c)
  });
}

function resetDocInFrame(doc, targetDocument) {
  var newChilds = [];
  for (var i = 0; i < doc.body.childNodes.length; i++) {
    var child = doc.body.childNodes[i];
    child.id !== "stop-editing" && newChilds.push(child)
  }
  newChilds.forEach(c => {
    targetDocument.adoptNode(c);
    targetDocument.body.appendChild(c)
  });
}
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
function moveUp($self) {
  $self.preventIframeMousedown.style.display = "none";
  $self.preventMouseOut.style.cursor = "";
}
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
function registerPointDown(e, $self, cursor) {
  $self.x = e.x;
  $self.y = e.y;
  $self.preventIframeMousedown.style.display = "block";
  $self.preventMouseOut.style.cursor = cursor + "-resize";
}

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
function popupCoords(offsetEl) {
  offsetEl = offset(offsetEl);
  var t = offsetEl.top;
  var l = offsetEl.left;

  var dualScreenLeft = window.screenLeft;
  var dualScreenTop = window.screenTop;

  return {
    left: (dualScreenLeft + l),
    top: (dualScreenTop + t)
  }
}
function resizable($self) {
  var el = $self.panelElement;
  if (el.querySelector(".resizable-element"))
    return;
  var resizableTemplate = `<div class="nw resizable-element"></div>
    <div class="n resizable-element"></div>
    <div class="ne resizable-element"></div>
    <div class="e resizable-element"></div>
    <div class="se resizable-element"></div>
    <div class="s resizable-element"></div>
    <div class="sw resizable-element"></div>
    <div class="w resizable-element"></div>`;
  el.insertAdjacentHTML("beforeend", resizableTemplate);
  var n = el.querySelector(".n");
  var e = el.querySelector(".e");
  var w = el.querySelector(".w");
  var s = el.querySelector(".s");
  var nw = el.querySelector(".nw");
  var sw = el.querySelector(".sw");
  var se = el.querySelector(".se");
  var ne = el.querySelector(".ne");
  var dragSettings = {
    preventMouseOut: true,
    grabCursors: false,
    grabbingClass: false
  };
  // S
  var sDrag = __drag(s, dragSettings);
  sDrag.on("down", (e) => registerPointDown(e, $self, "s"));
  sDrag.on("move", (e) => moveS(e, $self));
  sDrag.on("up", (e) => moveUp($self));
  $self.preventMouseOut = sDrag.preventMouseOut;
  // E
  var eDrag = __drag(e, dragSettings);
  eDrag.on("down", (e) => registerPointDown(e, $self, "e"));
  eDrag.on("move", (e) => moveE(e, $self));
  eDrag.on("up", (e) => moveUp($self));
  // SE
  var seDrag = __drag(se, dragSettings);
  seDrag.on("down", (e) => registerPointDown(e, $self, "se"));
  seDrag.on("move", (e) => {
    moveS(e, $self);
    moveE(e, $self);
  });
  seDrag.on("up", (e) => moveUp($self));
  // N
  var nDrag = __drag(n, dragSettings);
  nDrag.on("down", (e) => registerPointDown(e, $self, "n"));
  nDrag.on("move", (e) => moveN(e, $self));
  nDrag.on("up", (e) => moveUp($self));
  // W
  var wDrag = __drag(w, dragSettings);
  wDrag.on("down", (e) => registerPointDown(e, $self, "w"));
  wDrag.on("move", (e) => moveW(e, $self));
  wDrag.on("up", (e) => moveUp($self));
  // NW
  var nwDrag = __drag(nw, dragSettings);
  nwDrag.on("down", (e) => registerPointDown(e, $self, "nw"));
  nwDrag.on("move", (e) => {
    moveN(e, $self);
    moveW(e, $self);
  });
  nwDrag.on("up", (e) => moveUp($self));
  // SW
  var swDrag = __drag(sw, dragSettings);
  swDrag.on("down", (e) => registerPointDown(e, $self, "sw"));
  swDrag.on("move", (e) => {
    moveS(e, $self);
    moveW(e, $self);
  });
  swDrag.on("up", (e) => moveUp($self));
  // NE
  var neDrag = __drag(ne, dragSettings);
  neDrag.on("down", (e) => registerPointDown(e, $self, "ne"));
  neDrag.on("move", (e) => {
    moveN(e, $self);
    moveE(e, $self);
  });
  neDrag.on("up", (e) => moveUp($self));
}
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

})();