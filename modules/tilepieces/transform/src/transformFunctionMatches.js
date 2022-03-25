function matchTransformFunctions(string) {
  var m;
  var tokens = [];
  var index = 0;
  while (string && (m = string.match(/([a-zA-Z0-9]+)\([^)]*\)/))) {
    var token = {
      name: m[1],
      value: m[0].replace(m[1] + "(", "").replace(")", ""),
      index
    };
    tokens.push(token);
    string = string.substring(m.index + m[1].length);
    index++;
  }
  return tokens;
}