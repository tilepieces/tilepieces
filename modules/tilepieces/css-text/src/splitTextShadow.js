// todo remove
function splitTextShadow(textShadow) {
  var textShadowSwap = textShadow;
  var commas = [];
  var possibleComma = textShadow.indexOf(",");
  var falseIndex = 0;
  var count = 0;
  while (possibleComma > -1) {
    var falseComma = textShadowSwap.match(commaToNotTakeInConsideration);
    if (!falseComma ||
      (possibleComma < falseComma.index ||
        possibleComma > (falseComma.index + falseComma[0].length))) {
      commas.push(falseIndex + possibleComma);
      falseIndex += possibleComma
    } else falseIndex = falseIndex + falseComma[0].length;
    textShadowSwap = textShadowSwap.substring(falseIndex);
    possibleComma = textShadowSwap.indexOf(",");
    count++;
    if (count > 50000)
      throw new Error(["textShadow", textShadow, "textShadowSwap", textShadowSwap, "possibleComma", possibleComma,
        "falseIndex", falseIndex].join(","))
  }
  if (!commas.length)
    return [textShadow];
  else {
    var textShadows = [];
    var start = 0;
    commas.forEach((c, i, a) => {
      textShadows.push(textShadow.substring(start, start + c).trim());
      if (i == a.length - 1) {
        textShadows.push(textShadow.substring(start + c + 1, textShadow.length).trim());
      }
      start = c;
    });
    return textShadows;
  }
}