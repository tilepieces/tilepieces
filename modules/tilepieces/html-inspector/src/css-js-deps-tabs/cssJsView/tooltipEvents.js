function cssJsTooltipEvent(tooltipEl) {
  tooltipEl.addEventListener("click", e => {
    var actionName = e.target.dataset.name;
    if (!actionName) return;
    switch (actionName) {
      case "reveal":
        selectedTab.click();
        break;
      case "remove-element":
        autoInsertionJsCss = true;
        if (treeBuilder.multiselection)
          multiSelectionJsCss.forEach(mc => delEl(mc.el, mc.listEl, false));
        else
          delEl(selectedJsCSS["__html-tree-builder-el"], selectedJsCSS, false);
        selectedJsCSS = null;
        selected = null;
        app.core.deselectElement();
        break;
      case "edit":
        var sel = selectedJsCSS["__html-tree-builder-el"];
        var mode = sel.tagName == "SCRIPT" ? "js" : "css";
        var valueFetch = (sel.tagName == "SCRIPT" && sel.src) || (sel.tagName == "LINK" && sel.href);
        if (valueFetch) {
          var src = sel.tagName == "SCRIPT" ? sel.getAttribute("src") : sel.getAttribute("href");
          var srcParsed = src[0] == "/" ? encodeURI(app.utils.paddingURL(app.frameResourcePath())) + src.substring(1) : src;
          var urlToFetch = new URL(srcParsed, app.core.currentWindow.location.href)
          fetch(urlToFetch)
            .then(res => {
              if (res.status == 200) {
                return res.text();
              } else {
                console.error("[trying edit, resource status not 200]", res);
                opener.alertDialog("fail to edit, resource status not 200", true);
                return false;
              }
            }, err => {
              dialog.close();
              console.error("[trying edit, network error]", err);
              opener.alertDialog("fail to edit, network error]", true)
            })
            .then(value => {
              if(value !== false)
                createEditorCssJs(urlToFetch.pathname.replace(encodeURI(app.utils.paddingURL(app.frameResourcePath())),""), value, mode, sel)
            })
        } else createEditorCssJs("", sel.tagName == "SCRIPT" ?
          sel.innerHTML :
          [...sel.sheet.cssRules].map(v => v.cssText).join("\n"), mode, sel);
        break;
      case "set-as-current":
        app.core.setCurrentStyleSheet(selectedJsCSS["__html-tree-builder-el"]);
        break;
      case "save":
        saveStylesheet();
    }
    tooltipEl.style.display = "none";
  });
}