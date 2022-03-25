appView.addEventListener("theader", e => {
  var theaderValue = e.detail.target.checked;
  var tableTarget = globalModel.tableTarget;
  if (theaderValue)
    htmlMatch.createTHead(tableTarget);
  else
    htmlMatch.deleteTHead(tableTarget);
});