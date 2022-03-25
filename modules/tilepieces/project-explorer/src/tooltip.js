function tooltip(e, el) {
  //overlay.blur();
  var domElement = tooltipEl;
  if (domElement.contains(e.target) || domElement == e.target)
    return;
  var x = e.pageX;
  var y = e.pageY;
  var win = e.target.getRootNode().defaultView;
  var zero = win.scrollY;
  if (domElement.style.display != "block") {
    domElement.style.display = "block";
  }
  var sel = domElement.querySelector(".selected");
  sel && sel.classList.remove("selected");
  domElement.focus();
  var box = domElement.getBoundingClientRect();
  if (x + box.width > win.innerWidth) {
    x = x - box.width;
    if (x < zero) x = zero;
  }
  if (y + box.height > win.innerHeight) {
    y = y - box.height;
    if (y < zero) y = zero;
  }
  domElement.style.transform = `translate(${x}px,${y}px)`;
}
