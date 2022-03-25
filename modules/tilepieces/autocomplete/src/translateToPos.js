function translateToPos(x, y) {
  var box = hint.getBoundingClientRect();
  if (y + box.height > window.innerHeight) {
    y = y - box.height;
    if (y < 0) y = 0;
    hint.style.transform = `translate(${x}px,${y}px)`;
  }
  //hint.style.transform = "translate3d(" + Math.round(left) + "px," + Math.round(bottom) + "px,0)";
}