function removePointerEvents($self) {
  $self.colorStops.addEventListener("pointerdown", e => {
    if (!e.target.classList.contains("remove-color-stop") || $self.stopPointDragged)
      return;
    $self.model.colorStops.splice(+e.target.dataset.index, 1);
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