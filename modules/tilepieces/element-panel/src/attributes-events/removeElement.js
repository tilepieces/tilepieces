delNodeAttribute.addEventListener("click", e => {
  app.core.htmlMatch.removeChild(app.elementSelected);
  if (app.multiselected) {
    var index = app.multiselections.findIndex(v => v.el == app.elementSelected);
    app.removeItemSelected(index);
  } else
    app.core.deselectElement();
});