async function clickOnComponent(e) {
  var target = e.target;
  var isAddCss = target.classList.contains("add-component-css");
  var isAddJs = target.classList.contains("add-component-js");
  var isAddHtml = target.classList.contains("add-component-html");
  var isAddBundle = target.classList.contains("add-component-bundle");
  if (!isAddCss && !isAddJs && !isAddHtml && !isAddBundle)
    return;
  opener.dialog.open("importing component in project...", true);
  var name = target.dataset.name;
  var component = app.localComponentsFlat[name];
  if (!component && app.isComponent && name == app.isComponent.name)
    component = app.isComponent;
  var newHTMLElement;
  try {
    var dependenciesFlat = getDependenciesFlat(component);
    for (var d = 0; d < dependenciesFlat.length; d++) {
      var c = dependenciesFlat[d];
      newHTMLElement = (isAddHtml || isAddBundle) && await addComponentHTML(c);
      if (component.addDependenciesToBundles && c != component)
        continue;
      (isAddCss || isAddBundle) && c.bundle?.stylesheet?.href && await addComponentCss(c,
        d, dependenciesFlat);
      (isAddJs || isAddBundle) && c.bundle?.script?.src && await addComponentJs(c,
        d, dependenciesFlat)
    }
  } catch (e) {
    opener.dialog.close();
    console.error("[error in reading and importing script src from component]", e);
    opener.alertDialog("error in reading and importing script src from component",true);
    return;
  }
  //newHTMLElement && app.core.selectElement(newHTMLElement);
  opener.dialog.open("component installed correctly");
}
componentSection.addEventListener("click", clickOnComponent);