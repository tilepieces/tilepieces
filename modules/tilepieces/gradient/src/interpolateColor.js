// https://codepen.io/njmcode/pen/axoyD?editors=0010
// Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
// Taken from the awesome ROT.js roguelike dev library at
// https://github.com/ondras/rot.js
var _interpolateColor = function (color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5;
  }
  var result = color1.slice();
  for (var i = 0; i < 3; i++)
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  result[3] = color1[3];
  if (color1[3] != color2[3])
    result[3] = (color1[3] + color2[3]) * factor;
  return result;
};