function hexToRGBA(hex) {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    var c;
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 1];
  }
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16),
    a = hex.slice(7, 9) ? parseInt(hex.slice(7, 9), 16) : 255;

  return [r, g, b, (a / 255)];
  //return "rgba(" + r + ", " + g + ", " + b + ", " + (a/255) + ")";
}