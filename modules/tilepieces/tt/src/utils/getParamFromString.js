function getParamFromString(string, root, separator = ".") {
  if (!string.length) {
    return root;
  }
  var model = string.split(/\[|\]|\./).filter(v => v);//splitStringInModel(string,separator);
  var actualModel = root;
  for (var i = 0; i < model.length - 1; i++)
    actualModel = actualModel[model[i]];
  try {
    return actualModel[model[model.length - 1]];
  } catch (e) {
    console.error("can't find " + string + " in model\n", root);
    console.trace();
    throw new Error(e);
  }
}
