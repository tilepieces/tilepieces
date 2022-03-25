function addPointer($self) {
  $self.gradientDOM.addEventListener("pointerdown", e => {
    if (!e.target.classList.contains("color-stops") || $self.stopPointDragged)
      return;
    // get new array position
    var bounds = $self.colorStops.getBoundingClientRect();
    var pos = e.clientX - bounds.left;
    var colorStopsOffsets = getPxColorStopsOffsets($self);
    var newColorStopFake = {left: pos, index: -1};
    colorStopsOffsets.push(newColorStopFake);
    colorStopsOffsets.sort((a, b) => a.left - b.left);
    var newColorStopPos = colorStopsOffsets.findIndex(el => el == newColorStopFake);
    var previous = colorStopsOffsets[newColorStopPos - 1];
    var next = colorStopsOffsets[newColorStopPos + 1];
    var newColorStopColor;
    // pos : colorStops.offsetWidth = x : 100
    var percentage = Math.round((pos * 100) / bounds.width);
    if (!previous)
      newColorStopColor = next.color;
    else if (!next)
      newColorStopColor = previous.color;
    else {
      var total = next.left - previous.left;
      var posOverTwoStops = pos - previous.left;
      var ratio = posOverTwoStops / total;
      previous.color = normalizeColor(previous.color);
      next.color = normalizeColor(next.color);
      console.log(ratio, posOverTwoStops, total);
      var c = _interpolateColor(previous.color, next.color, ratio);
      newColorStopColor = "rgba(" + c.join(",") + ")";
    }
    $self.model.colorStops.splice(newColorStopPos, 0, {
      c: newColorStopColor,
      stopPos: percentage + "%"
    });
    $self.model.colorStops.forEach((v, i, a) => {
      v.index = i;
      if (i == a.length - 1)
        v.endPos = null;
      if (i != a.length - 1) {
        v.nextColor = a[i + 1].c;
        var indexPos = i + 1;
        var nextStop = a[indexPos].stopPos;
        calculateEndPos($self, v, nextStop);
      }

    });
    $self.t.set("colorStops", $self.model.colorStops);
    getImageFromModel($self)
  });
}
