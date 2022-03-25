function getImageFromModel($self) {
  var model = $self.model;
  var func = model.gradientType;
  var p = model.parameters ? model.parameters + "," : "";
  var colorStopsForG = model.colorStops.map((cs, i, a) => cs.c + " " + cs.stopPos +
    (cs.endPos && i != a.length - 1 ? "," + cs.endPos : "")).join(",");
  var dec = func + "(" + p + colorStopsForG + ")";
  model.declarationForView = `linear-gradient(90deg,${colorStopsForG})`;
  $self.t.set("declarationForView", model.declarationForView);
  $self.gradientDOM.dispatchEvent(new CustomEvent("gradient-change", {
    detail: dec
  }));
}