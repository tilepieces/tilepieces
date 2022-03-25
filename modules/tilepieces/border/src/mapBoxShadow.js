function mapBoxShadow(boxShadowStat) {
  if (boxShadowStat == "none")
    model.boxShadows = [];
  else {
    var boxShadows = opener.tilepieces.utils.splitCssValue(boxShadowStat);
    model.boxShadows = boxShadows.map((s, index) => {
      var colorMatch = s.match(opener.tilepieces.utils.colorRegex);
      var values = s.match(opener.tilepieces.utils.valueRegex);
      var numberoffsetX = values[0].match(opener.tilepieces.utils.numberRegex);
      var numberoffsetY = values[1].match(opener.tilepieces.utils.numberRegex);
      var blur = values[2] ? values[2].match(opener.tilepieces.utils.numberRegex) : 0;
      var spread = values[3] ? values[3].match(opener.tilepieces.utils.numberRegex) : 0;
      var inset = s.match(/(^|\s)inset($|\s)/);
      return {
        index,
        type: inset ? "inset" : "outset",
        color: colorMatch ? colorMatch[0] : "rgb(0,0,0)",
        offsetX: numberoffsetX ? numberoffsetX[0] : 0,
        offsetY: numberoffsetY ? numberoffsetY[0] : 0,
        blur: blur ? blur[0] : 0,
        spread: spread ? spread[0] : 0
      }
    });
  }
}