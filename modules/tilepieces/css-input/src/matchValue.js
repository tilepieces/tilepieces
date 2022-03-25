function findValues(value) {
  var mNumber = value.match(numberRegex);
  if (mNumber) { //lookbehind
    var prev = value.charAt(mNumber.index - 1);
    if (prev && !prev.match(/\s|,|\(/))
      mNumber = null;
  }
  var mUnit = value.match(cssUnitsRegex);
  var mUrl = value.match(urlRegex);
  var mColor = value.match(colorRegex);
  var arrValues = [mNumber, mUnit, mUrl, mColor];
  return {
    arrValues,
    found: arrValues.filter(f => f)
  };
}

function matchValue(value) {
  var tokens = [];
  var incr = 0;
  var values = findValues(value);
  while (values.found.length) {
    var first = values.found.sort((a, b) => a.index - b.index)[0];
    var indexForMap = values.arrValues.indexOf(first);
    var end = first.index + first[0].length;
    tokens.push({
      end: incr + end,
      type: mapArrValues[indexForMap],
      start: incr + first.index
    });
    value = value.substring(end);
    values = findValues(value);
    incr += end;
  }
  return tokens
}