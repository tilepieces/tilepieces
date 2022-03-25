function createEditorCssJs(src, value, mode, originalElement) {
  app.codeMirrorEditor(value, mode)
    .then(res => {
      if (src) {
        app.storageInterface.update(src, new Blob([res]))
          .then(ok => {
              var newElement = originalElement.cloneNode();
              app.core.htmlMatch.replaceWith(originalElement, newElement)
              selectedJsCSS = {"__html-tree-builder-el": newElement};
            },
            err => {
              console.error("[update resource error]", err);
              opener.alertDialog("update resource error")
            })
      } else {
        var newScript = originalElement.cloneNode();
        newScript.innerHTML = res;
        app.core.htmlMatch.replaceWith(originalElement, newScript);
        selectedJsCSS = {"__html-tree-builder-el": newScript};
      }
    }, e => console.error(e));
}