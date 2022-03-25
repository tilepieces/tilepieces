appView.addEventListener("caption", e => {
  var captionValue = e.detail.target.checked;
  var tableTarget = globalModel.tableTarget;
  if (captionValue)
    htmlMatch.createCaption(tableTarget);
  else
    htmlMatch.deleteCaption(tableTarget);
});