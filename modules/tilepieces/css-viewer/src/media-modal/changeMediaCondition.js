function changeMediaCondition(e) {
  console.log("changeMediaCondition has been called");
  if (e && (
    (e.detail.target && !e.detail.target.closest("#modal-media-queries")) ||
    (!e.detail.target && modalNewGr.style.display != "block") // resize
  )
  )
    return;
  console.log("changeMediaCondition is processing");
  if (model.mediaQueryUIMask == "min-max-width")
    addQueryAppliedCond =
      (model.mediaQueryMainLogicalOperator ? model.mediaQueryMainLogicalOperator + " " : "") +
      model.mediaQueryUIMaskMediaType +
      model.mediaQueryUIMaskFeatures
        .map(v => " " + v.logicalOperator + " (" + v.feature + ":" + v.value + ")").join("");
  else
    addQueryAppliedCond = model.mediaQueryUIFreeHand.trim();
  console.log("addQueryAppliedCond", addQueryAppliedCond);
  var matchMedia = app.core.currentWindow.matchMedia(addQueryAppliedCond);
  if (matchMedia.matches) {
    model.mediaQueryUIFreeHand = matchMedia.media;
    addQueryAppliedCond = matchMedia.media;
    model.mediaqueryuidisabled = "";
  } else
    model.mediaqueryuidisabled = "disabled";
  t.set("", model);
  inputCss(appView);
}

appView.addEventListener("template-digest", changeMediaCondition);
opener.addEventListener("frame-resize", changeMediaCondition);