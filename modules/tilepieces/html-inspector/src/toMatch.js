function toMatch(match) {
  var sourceTarget = selected["__html-tree-builder-el"];
  //var toMatch = sourceTarget.nodeType == 3 ? sourceTarget.parentNode : sourceTarget;
  selectedIsMatch = match || app.core.htmlMatch.find(sourceTarget);
  if (sourceTarget.nodeType == 3 && selectedIsMatch)
    selectedIsMatch = selectedIsMatch.HTML && selectedIsMatch;
  if (!selectedIsMatch) {
    console.warn("no match :", toMatch);
    //selectedIsMatch = false;
    //return false;
  }
  //else
  //selectedIsMatch = true;
  return selectedIsMatch;
}