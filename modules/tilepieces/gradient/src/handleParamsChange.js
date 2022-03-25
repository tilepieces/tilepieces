function handleParamsChange($self) {
  $self.parameters.addEventListener("input", e => {
    $self.model.parameters = $self.parameters.innerText;
    getImageFromModel($self);
    if ($self.model.gradientType == "linear-gradient" ||
      $self.model.gradientType == "repeating-linear-gradient") {
      var newAngle = getAngleFromParameters($self.model.parameters)
      $self.knob.set(newAngle);
    }
  });
  $self.gradientDOM.addEventListener("gradientType", e => {
    $self.model.parameters = "";
    $self.parameters.textContent = "";
    $self.model.gradientType = e.detail.target.value;
    $self.model.knobIsVisible = $self.model.gradientType == "linear-gradient" ||
      $self.model.gradientType == "repeating-linear-gradient";
    $self.t.set("", $self.model);
    getImageFromModel($self)
  });
  $self.colorStops.addEventListener("click", e => {
    if (!e.target.classList.contains("color-stop-button"))
      return;
    var color = e.target.style.backgroundColor;
    var index = +e.target.dataset.index;
    opener.tilepieces.colorPicker(color).onChange(c => {
      var newColor = c.rgba[3] < 1 ? c.rgbaString : c.rgbString;
      $self.model.colorStops[index].c = newColor;
      if (index > 0)
        $self.model.colorStops[index - 1].nextColor = newColor;
      $self.t.set("", $self.model);
      getImageFromModel($self);
    })
  })
}