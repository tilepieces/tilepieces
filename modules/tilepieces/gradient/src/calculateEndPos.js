function calculateEndPos($self, stopPos, nextStop) {
  var pos = stopPos.stopPos;
  var thisStopUnit = pos.match(cssUnitsRegex);
  var posNumber = +pos.match(numberRegex)[0];
  if (thisStopUnit[0] != "%") {
    if (thisStopUnit[0] == "px")
      posNumber = (100 * posNumber) / $self.gradientImage.offsetWidth;
    else
      posNumber = (100 * getDimension($self.gradientImage, nextStop)) / $self.gradientImage.offsetWidth;
  }
  var nextStopUnit = nextStop.match(cssUnitsRegex);
  var nextStopNumber = +nextStop.match(numberRegex)[0];
  if (nextStopUnit[0] != "%") {
    if (nextStopUnit[0] == "px")
      nextStopNumber = (100 * nextStopNumber) / $self.gradientImage.offsetWidth;
    else
      nextStopNumber = (100 * getDimension($self.gradientImage, nextStop)) / $self.gradientImage.offsetWidth;
  }
  stopPos.endPos = ((nextStopNumber + posNumber) / 2) + "%";
  console.log(stopPos.stopPos);
}