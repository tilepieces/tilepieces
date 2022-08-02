let linearGradientRegex = /linear-gradient\(([^)]*)\)|repeting-linear-gradient\(([^)]*)\)|radial-gradient\(([^)]*)\)|repeting-radial-gradient\(([^)]*)\)/;
let gradientsName = /linear-gradient|repeting-linear-gradient|radial-gradient|repeting-radial-gradient/;

function matchGradients(cssBackgroundStyle) {
  // first, change all rgb[a],hls[a] removing commas and parenthesis with another character
  var s = cssBackgroundStyle;
  var m = s.match(parenthesisToAvoid);
  var st = 0;
  while (m) {
    cssBackgroundStyle = cssBackgroundStyle.substring(0, st + m.index) +
      m[0].replace(/\(/g, "[").replace(/\)/g, "]").replace(/,/g, "?") + cssBackgroundStyle.substring(st + m.index + m[0].length);
    st = st + m.index + m[0].length;
    s = s.substring(m.index + m[0].length);
    m = s.match(parenthesisToAvoid);
  }
  // then match gradients;
  var gradients = [];
  var gradient = cssBackgroundStyle.match(linearGradientRegex);
  while (gradient) {
    // sometimes, the match is not in 1.
    s = gradient.find((v,i)=>v && i);
    var g = s.replace(/\[/g, "(").replace(/]/g, ")");
    var gradientParameters = g.split(",").map(v => v.replace(/\?/g, ","));
    var gradientType = gradient[0].match(gradientsName)[0];
    var gradientDecompiled = getGradientStops(gradientParameters, gradientType);
    gradientDecompiled.declarationForView = `linear-gradient(90deg,${gradientParameters.join(",")})`;
    gradients.push(gradientDecompiled);
    cssBackgroundStyle = cssBackgroundStyle.substring(gradient.index + gradient[0].length);
    gradient = cssBackgroundStyle.match(linearGradientRegex);
  }
  return gradients
}

window.matchGradients = matchGradients;