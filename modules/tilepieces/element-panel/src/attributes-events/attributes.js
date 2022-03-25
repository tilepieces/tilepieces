addAttrButton.addEventListener("click", e => {
  modelAttributes.attributes.forEach(v => v.index += 1);
  modelAttributes.attributes.unshift({
    name: "",
    value: "",
    disabled: "",
    index: 0
  });
  attrsTemplate.set("attributes", modelAttributes.attributes);
  var attributes = attributesView.querySelectorAll(".attribute-name");
  attributes[0].focus();
});
attributesView.addEventListener("click", e => {
  var t = e.target;
  if (!t.classList.contains("remove-attr"))
    return;
  var index = t.dataset.index;
  var attr = modelAttributes.attributes[index];
  app.core.htmlMatch.removeAttribute(app.elementSelected, attr.name);// || attributeSelected.value);
  var match = tilepieces.core.htmlMatch.find(app.elementSelected);
});
attributesView.addEventListener("focus", e => {
  elementToChange = app.elementSelected;
  elementToChangeTarget = e.target.cloneNode(true);
}, true);
attributesView.addEventListener("input", e => {
  elementToChangeTarget = e.target.cloneNode(true);
}, true);
attributesView.addEventListener("change", e => {
  var currentElement = elementToChange;
  var target = elementToChangeTarget;
  var isAttributeName = target.classList.contains("attribute-name");
  var isAttributeValue = target.classList.contains("attribute-value");
  if (!isAttributeValue && !isAttributeName)
    return;
  if (isAttributeName) {
    target.dataset.prev && app.core.htmlMatch.removeAttribute(currentElement, target.dataset.prev);
    try {
      app.core.htmlMatch.setAttribute(currentElement, target.value, target.dataset.value);
    } catch (e) {
      alertDialog(e.toString(), true);
    }
  } else if (isAttributeValue) {
    try {
      app.core.htmlMatch.setAttribute(currentElement, target.dataset.key, target.value);
    } catch (e) {
      alertDialog(e.toString(), true);
    }
  }
}, true);

