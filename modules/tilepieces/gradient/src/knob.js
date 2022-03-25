function DOMKnob(DOMel) {
  var $self = this;
  $self.knob = DOMel;
  $self.centerX = 0;
  $self.centerY = 0;
  $self.UP = false;
  $self.changeCbs = [];
  $self.onChange = cb => {
    $self.changeCbs.push(cb);
  };
  $self.set = degrees => {
    $self.knob.style.transform = "rotate(" + degrees + "deg)";
  }
  $self.bounds = {};

  function calculateAngle(x, y) {
    return Math.atan((x - $self.centerX) / (y - $self.centerY));// * (180 / Math.PI)
  }

  function start(e) {
    $self.UP = true;
    $self.bounds = $self.knob.getBoundingClientRect();
    $self.centerX = $self.bounds.left + ($self.bounds.width / 2);
    $self.centerY = $self.bounds.top + ($self.bounds.height / 2);
    knobRotation(e);
    $self.knob.ownerDocument.addEventListener("pointermove", knobRotation);
    $self.knob.ownerDocument.addEventListener("pointerup", release);
  }

  function knobRotation(e) {
    if (!$self.UP)
      return;
    var angle = calculateAngle(e.clientX, e.clientY);
    var topRight = e.clientX >= $self.centerX && e.clientY < $self.centerY;
    var bottomRight = e.clientX >= $self.centerX && e.clientY >= $self.centerY;
    var bottomLeft = e.clientX < $self.centerX && e.clientY >= $self.centerY;
    var topLeft = e.clientX < $self.centerX && e.clientY < $self.centerY;
    var angleInDeg = Math.round(angle * (180 / Math.PI));
    if (topRight)
      angleInDeg = -(angleInDeg);
    else if (bottomRight)
      angleInDeg = 180 - angleInDeg;
    else if (bottomLeft)
      angleInDeg = 180 - angleInDeg;
    else if (topLeft)
      angleInDeg = 360 - angleInDeg;
    $self.knob.style.transform = "rotate(" + angleInDeg + "deg)";
    $self.changeCbs.forEach(cb => cb(angleInDeg));

  }

  function release() {
    if ($self.UP)
      $self.UP = false;
    $self.knob.ownerDocument.removeEventListener("pointermove", knobRotation);
    $self.knob.ownerDocument.removeEventListener("pointerup", release);
  }

  $self.knob.addEventListener("pointerdown", start);
  return $self;
}