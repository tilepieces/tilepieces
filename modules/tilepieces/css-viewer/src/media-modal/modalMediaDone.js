appView.addEventListener("click", e => {
  if (!e.target.classList.contains("modal-media-done"))
    return;
  if (appendOn) {
    app.core.insertCssRule(appendOn, "@media " + addQueryAppliedCond + "{}");
  } else {
    app.core.setCssMedia("@media " + addQueryAppliedCond + "{}");
  }
  app.core.runcssMapper()
    .then(styles => {

      console.log("new @media created -> appendOn ->", appendOn,
        "\nactual rule ->", appendOn ? appendOn.cssRules[appendOn.cssRules.length - 1] :
          app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1]);

      if (model.mediaQueryUICheck)
        app.core.currentMediaRule = appendOn ? appendOn.cssRules[appendOn.cssRules.length - 1] :
          app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1];
      setTemplate();
      modalNewGr.style.display = "none";
      appView.ownerDocument.body.classList.remove("modal");
    });
});