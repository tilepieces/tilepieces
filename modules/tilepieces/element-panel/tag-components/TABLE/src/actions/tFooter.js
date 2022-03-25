appView.addEventListener("tfooter", e => {
  var tfooterValue = e.detail.target.checked;
  var tableTarget = globalModel.tableTarget;
  if (tfooterValue)
    htmlMatch.createTFoot(tableTarget);
  else
    htmlMatch.deleteTFoot(tableTarget);
});