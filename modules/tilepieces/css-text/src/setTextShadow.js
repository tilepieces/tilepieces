function setTextShadow(textShadows) {
  var newTextShadows = textShadows.map(ts => {
    return ts.offsetX + "px " + ts.offsetY + "px " + ts.blur + "px " + ts.color;
  }).join(",");
  return setCss("text-shadow", newTextShadows);
}