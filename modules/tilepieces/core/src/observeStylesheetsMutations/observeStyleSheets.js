let globalPendingStyle;

function updateStyles($self) {
  console.log("[is updating styles...]");
  console.log("[globalPendingStyle] ", globalPendingStyle);
  $self.checkCurrentStyleSheet();
  $self.runcssMapper();
  if (globalPendingStyle)
    globalPendingStyle = false;
}

function styleObs(mutation, $self) {
  var hasStylesChanged, hasStylesOnAsync;
  if (mutation.type == "attributes" &&
    (mutation.attributeName.toLowerCase() == "href" ||
      mutation.attributeName.toLowerCase() == "disabled") &&
    mutation.target.tagName == "LINK" &&
    mutation.target.rel.toLowerCase() == "stylesheet") {
    if (mutation.attributeName.toLowerCase() == "href")
      $self.fetchingStylesheet(mutation.target.getAttribute("href")).then(() => {
        // at this point, sheet should be loaded. However, we do longPolling, just in case.
        longPollingStyleSheet(mutation.target, () => updateStyles($self))
      }, err => {
        globalPendingStyle && updateStyles($self);
      });
    else
      hasStylesChanged = true;
  }
  if (mutation.type == "childList" &&
    mutation.target.tagName == "STYLE")
    hasStylesChanged = true;
  mutation.addedNodes.forEach(v => {
    if (v.tagName == "STYLE" && v.sheet)
      hasStylesChanged = true;
    if (v.tagName == "LINK" && v.rel.toLowerCase() == "stylesheet") {
      if (!v.sheet) {
        hasStylesOnAsync = true;
        $self.fetchingStylesheet(v.getAttribute("href")).then(() => {
          // at this point, sheet should be loaded. However, we do longPolling, just in case.
          longPollingStyleSheet(v, () => updateStyles($self))
        }, err => {
          globalPendingStyle && updateStyles($self);
        });
      } else hasStylesChanged = true;
    }
  });
  mutation.removedNodes.forEach(v => {
    if ((v.tagName == "STYLE") ||
      (v.tagName == "LINK" && v.rel.toLowerCase() == "stylesheet")
    ) {
      hasStylesChanged = true;
    }
  });
  return {hasStylesChanged, hasStylesOnAsync};
}

function observeStyleSheets(mutationList, $self) {
  var hasStylesChanged, hasStylesOnAsync;
  mutationList.forEach(mutation => {
    var res = styleObs(mutation, $self);
    hasStylesChanged = res.hasStylesChanged || hasStylesChanged;
    hasStylesOnAsync = res.hasStylesOnAsync || hasStylesOnAsync;
  });
  hasStylesChanged && !hasStylesOnAsync && updateStyles($self);//$self.runcssMapper();
  if (hasStylesChanged && hasStylesOnAsync)
    globalPendingStyle = true;
}