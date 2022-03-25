function degFromAngleDeclaration(dec) {
  var angle = dec.match(angleTypes);
  var number = Number(dec.match(numberRegex)[0]);
  switch (angle[0]) {
    case "rad":
      return Math.round(number * (180 / Math.PI));
    case "turn":
      return number * 360;
    case "grad":
      return Math.round((360 * number) / 400);
  }
  console.log("pos number", number);
  if (number < 0)
    return 180 - Math.abs(number) - (360 * Math.trunc(Math.abs(number) / 360));
  if (number > 360)
    return number - (360 * Math.trunc(number / 360));
  return number;
}