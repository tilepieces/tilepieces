appView.addEventListener("focus", e => {
  var prop = e.target.dataset.cssProp || "";
  if (prop.match(/^(margin|padding|border)/)) {
    if (prop.startsWith("margin")) {
      app.editElements.margin = true;
    }
    if (prop.startsWith("padding")) {
      app.editElements.padding = true;
    }
    if (prop.startsWith("border")) {
      app.editElements.border = true;
    }
  }
}, true);
appView.addEventListener("blur", e => {
  app.editElements.margin = false;
  app.editElements.padding = false;
  app.editElements.border = false;
}, true);