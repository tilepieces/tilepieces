function match(input, arr) {
  var max = 9;
  var suggestions = input ? arr.filter(v => v.toLocaleLowerCase().startsWith(input) && v != input) : arr;
  if (!suggestions.length)
    return false;
  if (suggestions.length > max)
    suggestions = suggestions.slice(0, max - 1);
  return suggestions.map(v => {
    var toLowercase = v.toLocaleLowerCase();
    var m = "<b>" + toLowercase.substr(toLowercase.indexOf(input), input.length) + "</b>";
    return toLowercase.replace(input, m)
  })
}