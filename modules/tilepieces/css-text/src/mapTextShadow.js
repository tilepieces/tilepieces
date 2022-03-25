function mapTextShadow(textShadowStat) {
  if (textShadowStat == "none") {
    model.textShadows = []
  } else {
    var textShadows = app.utils.splitCssValue(textShadowStat);//splitTextShadow();
    model.textShadows = textShadows.map((s, index) => {
      var colorMatch = s.match(app.utils.colorRegex);
      var values = s.match(app.utils.valueRegex);
      var numberoffsetX = values[0].match(app.utils.numberRegex);
      var numberoffsetY = values[1].match(app.utils.numberRegex);
      var blur = values[2] ? values[2].match(app.utils.numberRegex) : 0;
      var blurToSlider = !blur ? 0 : blur[0];
      return {
        index,
        color: colorMatch ? colorMatch[0] : "rgb(0,0,0)",
        offsetX: numberoffsetX ? numberoffsetX[0] : 0,
        offsetY: numberoffsetY ? numberoffsetY[0] : 0,
        blur: blurToSlider,
        blurToSlider
      }
    })
  }
}