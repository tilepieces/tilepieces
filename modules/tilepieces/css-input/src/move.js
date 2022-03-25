function move(target, token, dir, range, incr) {
  var string = target.innerHTML;
  if (token.type == "number") {
    var number = Number(string.substring(token.start, token.end));
    var originalDecimalLength = ("" + number).split(".")[1];
    var newValue = 0;
    if (dir == "up")
      newValue = number + incr;
    if (dir == "down")
      newValue = number - incr;
    if (originalDecimalLength)
      newValue = newValue.toFixed(originalDecimalLength.length);
  }
  /*
  if(type == "unit") {
      var unit = string.substring(token.start, token.end);
      var index = cssUnits.indexOf(unit);
      if(dir == "up")
          newValue = cssUnits[index+1<cssUnits.length ? index+1 : 0];
      else
          newValue = cssUnits[index-1>=0 ? index-1 : cssUnits.length-1];
  }*/
  var firstP = string.substring(0, token.start);
  var endP = string.substring(token.end);
  target.textContent = firstP + newValue + endP;
  range.setStart(target.childNodes[0], token.start);
  range.setEnd(target.childNodes[0], token.start + ("" + newValue).length);
  target.dispatchEvent(new KeyboardEvent("input", {bubbles: true}));
}