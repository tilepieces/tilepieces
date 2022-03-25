let colorRegexFunctions = "rgb\\([^)]*\\)|rgba\\([^)]*\\)|#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|hsl\\([^)]*\\)|hsla\\([^)]*\\)";
let cssColorRegex = cssColors.map(v => v.name).join("|");
let colorRegex = new RegExp(colorRegexFunctions + "|" + cssColorRegex, "i");

function getGradientStops(arr, gradientType) {
  var parameters = "";
  if (arr[0] && !arr[0].match(colorRegex)) {
    parameters = arr[0];
    arr.splice(0, 1);
  } else {
    if (gradientType == "linear-gradient") {
      parameters = "180deg"
    }
  }
  var colorStops = arr.reduce((acc, v, i, a) => {
    var cMatch = v.trim().match(colorRegex);
    var color = cMatch && cMatch[0];
    if (color) {
      var isNameColor = cssColors.find(cssc => cssc.name.toLocaleLowerCase() == color.toLowerCase());
      if (isNameColor)
        color = isNameColor.hex;
    }
    var stop = cMatch ? v.replace(cMatch[0], "").trim() : v.trim();
    var endPos = null;
    if (!color) {
      acc[acc.length - 1].endPos = stop;
      return acc;
    }
    if (!stop) {
      if (i == 0)
        stop = "0%";
      else if (i == a.length - 1)
        stop = "100%";
    }
    acc.push({c: color, stopPos: stop, endPos, index: acc.length});
    return acc;
  }, []);
  return {parameters, colorStops, gradientType}
}