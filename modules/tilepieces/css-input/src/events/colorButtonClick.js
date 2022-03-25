function colorButtonClick(e) {
  var inputCssPlaceholder = e.target.closest(".input-css-placeholder");
  var color = e.target.nextElementSibling.textContent;
  var isNameColor = cssColors.find(c => c.name.toLocaleLowerCase() == color.trim().toLowerCase());
  if (isNameColor)
    color = isNameColor.hex;
  //opener.app.colorPicker.show();
  var throttle;
  opener.tilepieces.colorPicker(color).onChange(c => {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      var rgbColor = c.rgba[3] < 1 ? `rgba(${c.rgba[0]}, ${c.rgba[1]}, ${c.rgba[2]}, ${c.rgba[3]})` :
        `rgb(${c.rgba[0]}, ${c.rgba[1]}, ${c.rgba[2]})`;// TODO only rgb?
      e.target.nextElementSibling.textContent = rgbColor;
      e.target.style.background = rgbColor;
      setText(inputCssPlaceholder)
    }, 32)
  })
}