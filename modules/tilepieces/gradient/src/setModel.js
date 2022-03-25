function adjustModel(newModel, $self) {
  if (newModel.gradientType == "linear-gradient" || newModel.gradientType == "repeating-linear-gradient") {
    newModel.knobIsVisible = true;
    var angle = getAngleFromParameters(newModel.parameters);
    newModel.linearGradientAngle = angle;
    $self.knob.set(angle)
  } else { // isRadial
    newModel.knobIsVisible = false;
  }
  // fill colorStops
  newModel.colorStops = newModel.colorStops.map((v, i, a) => {
    if (!v.stopPos) {
      var indexFindPrevious = i - 1;
      var previousStop = a[indexFindPrevious];
      while (!previousStop.stopPos && indexFindPrevious > -1) {
        indexFindPrevious--;
        previousStop = a[indexFindPrevious]
      }
      var perc1 = convertStopToPerc(previousStop.stopPos, $self);
      var indexFindNext = i + 1;
      var nextStop = a[indexFindNext];
      var nextStopsWithout = 1;
      while (!nextStop.stopPos && indexFindNext > -1) {
        indexFindNext++;
        nextStopsWithout++;
        nextStop = a[indexFindNext];
      }
      var total = nextStopsWithout + 1;
      var perc2 = convertStopToPerc(nextStop.stopPos, $self);
      v.stopPos = (perc1 + ((perc2 - perc1) / total)) + "%";
    }
    return v;
  })
    .map((v, i, a) => {// fill colorEnd
      if (!v.endPos && i != a.length - 1) {
        var indexPos = i + 1;
        var nextStop = a[indexPos].stopPos;
        calculateEndPos($self, v, nextStop);
      }
      if (i != a.length - 1)
        v.nextColor = a[i + 1].c;
      return v;
    });
  newModel.canAdd = "canAdd";
  return newModel;
}

GradientView.prototype.set = function (newModel) {
  var $self = this;
  this.model = adjustModel(newModel, $self);
  this.t.set("", this.model);
  //if($self.parameters.ownerDocument.activeElement != $self.parameters)
  $self.parameters.textContent = $self.model.parameters;
  !this.noInputCss && inputCss(this.gradientDOM);
}