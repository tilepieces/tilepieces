let padding = 12; //color-stops has padding of 12px;
function moveColorStops($self) {
  let pos1, pos2, X, left, bounds, movedOffset;
  var colorStopsOffsets = [];
  $self.colorStops.addEventListener("pointerdown", e => {
    if (!e.target.classList.contains("color-stop-dragger") ||
      $self.stopPointDragged)
      return;
    $self.stopPointDragged = e.target.closest(".color-stop");
    $self.model.canAdd = "";
    document.documentElement.classList.add("dragGradient");
    bounds = $self.gradientDOM.getBoundingClientRect();
    left = $self.stopPointDragged.offsetLeft + padding;
    pos1 = e.clientX;
    colorStopsOffsets = getPxColorStopsOffsets($self);
    var index = +$self.stopPointDragged.dataset.index;
    $self.model.colorStops[index].endPos = null;
    if ($self.model.colorStops[index - 1])
      $self.model.colorStops[index - 1].endPos = null;
    e.target.setPointerCapture(e.pointerId);
    //$self.gradientDOM.ownerDocument.addEventListener("pointermove",move);
    //$self.gradientDOM.ownerDocument.addEventListener("pointerup",up);
    e.target.addEventListener("pointermove", move);
    e.target.addEventListener("pointerup", up);
    e.preventDefault();
  });

  function move(e) {
    pos2 = e.clientX - pos1;
    pos1 = e.clientX;
    left += pos2;
    var percentage = Math.round((left * 100) / bounds.width) + "%";
    var index = +$self.stopPointDragged.dataset.index;
    movedOffset = index;
    /* if we are not in the same position than before*/
    var thisStop = colorStopsOffsets.find(v => v.index == index);
    thisStop.left = left;
    colorStopsOffsets.sort((a, b) => a.left - b.left);
    var newColorStopPos = colorStopsOffsets.findIndex(el => el == thisStop);
    if (newColorStopPos != index) {
      var swap1 = JSON.stringify($self.model.colorStops[newColorStopPos]);
      $self.model.colorStops[newColorStopPos] = $self.model.colorStops[index];
      $self.model.colorStops[index] = JSON.parse(swap1);
      var swap2 = JSON.stringify(colorStopsOffsets[newColorStopPos]);
      colorStopsOffsets[newColorStopPos] = colorStopsOffsets[index];
      colorStopsOffsets[index] = JSON.parse(swap2);
      $self.model.colorStops[newColorStopPos].stopPos = percentage;
      //model.colorStops.forEach((v,i)=>v.index=i);
      $self.stopPointDragged.dataset.index = newColorStopPos;
      colorStopsOffsets.forEach((v, i) => v.index = i);
      movedOffset = newColorStopPos;
    } else
      $self.model.colorStops[index].stopPos = percentage;
    getImageFromModel($self)
  }

  function up(e) {
    $self.stopPointDragged = null;
    $self.model.canAdd = "canAdd";
    document.documentElement.classList.remove("dragGradient");
    //$self.gradientDOM.ownerDocument.removeEventListener("pointermove",move);
    //$self.gradientDOM.ownerDocument.removeEventListener("pointerup",up);
    e.target.removeEventListener("pointermove", move);
    e.target.removeEventListener("pointerup", up);
    $self.model.colorStops.forEach((v, i, a) => {
      v.index = i;
      if (i != a.length - 1)
        v.nextColor = a[i + 1].c;
      if (!v.endPos && i != a.length - 1) {
        var indexPos = i + 1;
        var nextStop = a[indexPos].stopPos;
        calculateEndPos($self, v, nextStop);
      }
      if (i == a.length - 1)
        v.endPos = null;
    });
    $self.t.set("", $self.model);
    e.target.releasePointerCapture(e.pointerId)
  }

}