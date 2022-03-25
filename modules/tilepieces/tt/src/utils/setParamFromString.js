function setParamFromString(string, root, value, separator = ".") {
  if (!string.length) {
    root = value;
    return root;
  }
  var model = splitStringInModel(string, separator);
  var actualModel = root;
  for (var i = 0; i < model.length - 1; i++)
    actualModel = actualModel[model[i]];
  return actualModel[model[model.length - 1]] = value;
}