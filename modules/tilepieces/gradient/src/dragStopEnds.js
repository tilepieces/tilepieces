function dragStopEnds($self) {
  let pos1, pos2, left, bounds;
  $self.colorInterpolationSlider.addEventListener("pointerdown", e => {
    var colorInterpolationEl = e.target.closest(".color-interpolation");
    if (!colorInterpolationEl ||
      $self.stopPointDragged)
      return;
    $self.stopPointDragged = colorInterpolationEl;
    bounds = $self.gradientDOM.getBoundingClientRect();
    left = $self.stopPointDragged.offsetLeft;
    pos1 = e.clientX;
    $self.gradientDOM.ownerDocument.addEventListener("pointermove", move);
    $self.gradientDOM.ownerDocument.addEventListener("pointerup", up);
  });

  function move(e) {
    pos2 = e.clientX - pos1;
    pos1 = e.clientX;
    left += pos2;
    var percentage = Math.round((left * 100) / bounds.width) + "%";
    var index = +$self.stopPointDragged.dataset.index;
    $self.model.colorStops[index].endPos = percentage;
    getImageFromModel($self)
  }

  function up(e) {
    $self.stopPointDragged = null;
    $self.gradientDOM.ownerDocument.removeEventListener("pointermove", move);
    $self.gradientDOM.ownerDocument.removeEventListener("pointerup", up);
  }

}