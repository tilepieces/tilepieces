function normalizeColor(c) {
  if (!c.match(rgbaRegex)) {
    if (c.match(hexRegex))
      c = hexToRGBA(c);
    if (c.match(hslRegex))
      c = hslToRgba(c.match(numberRegexGlobal).map(n => +n));
  } else {
    c = c.match(numberRegexGlobal).map(n => +n);
    if (typeof c[3] === "undefined")
      c[3] = 1;
  }
  return c;
}