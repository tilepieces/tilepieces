function setShadow() {
  var newBoxShadows = model.boxShadows.map(ts => {
    return (ts.type == "inset" ? "inset " : "") + ts.offsetX + "px " +
      ts.offsetY + "px " + ts.blur + "px " + ts.spread + "px " + ts.color;
  }).join(",");
  return setCss("box-shadow", newBoxShadows);
}