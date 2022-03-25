function convertVarToModel(variable, newScope) {
  var find = newScope
    .findIndex(v => variable.startsWith(v.variable + ".") ||
      v.variable == variable || variable.startsWith(v.variable + "["));
  var count = 0;
  var swapVariable = variable;
  while (find > -1) {
    variable = variable.replace(newScope[find].variable, newScope[find].iterable || newScope[find].original);
    find = newScope.findIndex(v => variable.startsWith(v.variable + ".") ||
      v.variable == variable || variable.startsWith(v.variable + "["));
    count++;
    if (count > newScope.length) {
      console.error("[TT] Model generate infinite loop:\nVariable->\"", swapVariable,
        "\"\nnewScope->", newScope);
      throw new Error();
    }
  }
  return variable;
}