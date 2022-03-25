function getGlobalSuggestion(string) {
  var keys = string.split(".");
  var global = window;
  keys.forEach(v => global = global[v]);
  return global;
}