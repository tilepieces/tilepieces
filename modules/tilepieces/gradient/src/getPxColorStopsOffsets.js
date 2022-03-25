function getPxColorStopsOffsets($self) {
  var colorStops = $self.colorStops.querySelectorAll(".color-stop");
  return [...colorStops].map(cs => {
    return {
      left: cs.offsetLeft,
      index: cs.dataset.index,
      color: cs.dataset.color
    }
  }).sort((a, b) => a.left - b.left);
}