/**
 *
 * @param string - the string representation of object
 * @param root - the root object
 * @param value - value to assign
 * @param separator - separator
 */
function sanitizeLastChar(string, separator) {// ( this is for the case "obj/propr/" -> "obj.propr." -> error!  )
  if (string.endsWith(separator))
    return string.substring(0, string.length - 1);
  return string;
}

function assignParamFromString(string, root, value, separator = ".") {
  if (!string.length) {
    root = value;
    return root;
  }
  var model = string.replace(/\[/g, ".").replace(/\]/g, "").split(separator);
  var actualModel = root;
  for (var i = 0; i < model.length - 1; i++)
    actualModel = actualModel[model[i]];
  return actualModel[model[model.length - 1]] = value;
}

function assignKeyFromString(string, root, value, separator = ".") {
  var model = sanitizeLastChar(string, separator).split(separator);
  var actualModel = root;
  for (var i = 0; i < model.length - 1; i++)
    actualModel = actualModel[model[i]];

  var temp = actualModel[model[model.length - 1]];
  delete actualModel[model[model.length - 1]];
  return actualModel[value] = temp;
}

function createKeyFromString(string, root, key, value, separator = ".") {
  if (!string.length) {
    root[key] = value;
    return;
  }
  var model = sanitizeLastChar(string, separator).split(separator);
  var actualModel = root;
  for (var i = 0; i < model.length - 1; i++)
    actualModel = actualModel[model[i]];

  var finalModel = actualModel[model[model.length - 1]];
  return finalModel[key] = value;
}

function returnParamFromString(string, root, separator = ".") {
  if (!string.length) {
    return root;
  }
  var model = sanitizeLastChar(string, separator).split(separator);
  var actualModel = root;
  for (var i = 0; i < model.length; i++)
    actualModel = actualModel[model[i]];

  return actualModel;
}

function deleteParamFromString(string, root, separator = ".") {
  var model = sanitizeLastChar(string, separator).split(separator);
  var actualModel = root;
  for (var i = 0; i < model.length - 1; i++)
    actualModel = actualModel[model[i]];

  if (Array.isArray(actualModel)) {
    var index = actualModel.indexOf(actualModel[model[model.length - 1]]);
    actualModel.splice(index, 1);
  } else
    delete actualModel[model[model.length - 1]];
}

function addArrayItemFromString(string, root, newItem, arrayIndex, separator = ".") {
  var model = sanitizeLastChar(string, separator).split(separator);
  var actualModel = root;
  for (var i = 0; i < model.length - 1; i++)
    actualModel = actualModel[model[i]];

  if (Array.isArray(actualModel))
    actualModel.splice(arrayIndex, 0, newItem);
  else
    throw new Error("removeArrayItemFromString string error: the representation is not an array")
}

function removeArrayItemFromString(string, root, arrayIndex, separator = ".") {
  var model = sanitizeLastChar(string, separator).split(separator);
  var actualModel = root;
  for (var i = 0; i < model.length - 1; i++)
    actualModel = actualModel[model[i]];

  if (Array.isArray(actualModel))
    actualModel.splice(arrayIndex, 1);
  else
    throw new Error("removeArrayItemFromString string error: the representation is not an array")
}