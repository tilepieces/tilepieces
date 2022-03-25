appView.addEventListener("click", e => {
  if (!e.target.classList.contains("support-done"))
    return;
  if (appendOn) {
    app.core.insertCssRule(appendOn, "@supports " + model.supportCondition + "{}");
  } else {
    app.core.setCssMedia("@supports " + model.supportCondition + "{}");
  }
  app.core.runcssMapper()
    .then(styles => {
      console.log("new @support created -> appendOn ->", appendOn,
        "\nactual rule ->", appendOn ? appendOn.cssRules[appendOn.cssRules.length - 1] :
          app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1]);

      if (model.mediaQueryUICheck)
        app.core.currentMediaRule = appendOn ? appendOn.cssRules[appendOn.cssRules.length - 1] :
          app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1];
      model.newGroupingType = "0";
      model.grFreehand = "";
      model.newgrbuttondisabled = "disabled";
      setTemplate();
      modalNewGr.style.display = "none";
      appView.ownerDocument.body.classList.remove("modal");
    });
});
appView.addEventListener("supportCondition", e => {
  var d = e.detail;
  d.target.value = d.target.value.trim();
  var support;
  try {
    support = app.core.currentWindow.CSS.supports(d.target.value)
  } catch (e) {
  }
  if (!support)
    model.newgrbuttondisabled = "disabled";
  else
    model.newgrbuttondisabled = "";
});