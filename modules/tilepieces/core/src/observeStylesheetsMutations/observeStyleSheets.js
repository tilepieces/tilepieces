let globalPendingStyle;

function updateStyles($self) {
  console.log("[is updating styles...]");
  console.log("[globalPendingStyle] ", globalPendingStyle);
  var currentStyleSheet = $self.currentStyleSheet;
  var currentStyleSheetSelector = "[" + tilepieces.currentStyleSheetAttribute + "]";
  if (currentStyleSheet &&
    !$self.currentDocument.documentElement.contains(currentStyleSheet.ownerNode)) {
    var match = $self.htmlMatch.match($self.matchCurrentStyleSheetNode, false, false, true);
    if (match) {
      $self.currentStyleSheet = match.sheet;
    } else {
      var possiblesCurrentStyleSheets = [...$self.currentDocument.querySelectorAll(currentStyleSheetSelector)];
      if (possiblesCurrentStyleSheets.length) {
        var last = possiblesCurrentStyleSheets.pop();
        $self.matchCurrentStyleSheetNode =
          $self.htmlMatch.match(last);
        if ($self.matchCurrentStyleSheetNode)
          $self.currentStyleSheet = last.sheet;
      } else {
        $self.currentStyleSheet = null;
        $self.matchCurrentStyleSheetNode = null;
      }
    }
  }
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