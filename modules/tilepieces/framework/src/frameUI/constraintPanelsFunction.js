function constraintPanelsFunction(newX, newY, deltaX, deltaY, dockObj) {
  // deltaX right and deltaY down are negative
  if (
    (deltaX < 0 &&
      (dockObj.leftPosition + newX + dockObj.width > window.innerWidth))
    ||
    (deltaX > 0 &&
      (dockObj.leftPosition + newX < 0))
    ||
    (deltaY < 0 &&
      (dockObj.topPosition + newY + dockObj.height > window.innerHeight))
    ||
    (deltaY > 0 &&
      (dockObj.topPosition + newY < 48))
  )
    return true;
}