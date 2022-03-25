opener.addEventListener("tilepieces-mutation-event", e => {
  var mutationList = e.detail.mutationList;
  console.log("[element panel log mutationList and flagForInternalModifications]->", mutationList, flagForInternalModifications);
  if (flagForInternalModifications) {
    flagForInternalModifications = false;
    return;
  }
  var findAttributeMutation, removedNode, childrenList;
  mutationList.forEach(mutation => {
    if (mutation.type == "childList" &&
      mutation.target == app.elementSelected)
      childrenList = true;
    if (mutation.type == "attributes" &&
      mutation.target == app.elementSelected)
      findAttributeMutation = true;
    mutation.removedNodes.forEach(v => {
      if (v == app.elementSelected)
        removedNode = true;
    });
  });
  if (removedNode) {
    wrapper.setAttribute("hidden", "");
  } else if (childrenList) {
    setChildrenElements();
  } else if (findAttributeMutation)
    onSelected(true);
})