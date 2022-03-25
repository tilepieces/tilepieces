function convertStopToPerc(pos, $self) {
  var posStopUnit = pos.match(cssUnitsRegex);
  var posStopNumber = +pos.match(numberRegex)[0];
  if (posStopUnit[0] != "%") {
    if (posStopUnit[0] == "px")
      posStopNumber = (100 * posStopNumber) / $self.gradientImage.offsetWidth;
    else
      posStopNumber = (100 * getDimension($self.gradientImage, posStopNumber)) / $self.gradientImage.offsetWidth;
  }
  return posStopNumber;
}