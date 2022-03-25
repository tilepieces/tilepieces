classes.addEventListener("template-digest", e => {
  var target = e.detail.target;
  if (target.closest("#new-class")) { // from the input box
    if (classesModel.classinvalid == "")
      classesTemplate.set("classinvalid", "hidden");
    return;
  }
  var className = target.dataset.value;
  var index = +target.dataset.index;
  var classStructure = classesModel.classes[index];
  var isInAssociated = associatedClasses.find(v => v.el = app.elementSelected);
  if (target.checked) {
    app.core.htmlMatch.addClass(app.elementSelected, className);
    var exAssociated = isInAssociated.classes.findIndex(v => v.name == classStructure.name);
    isInAssociated.classes.splice(exAssociated, 1);
  } else {
    classStructure.checked = false;
    if (!isInAssociated)
      associatedClasses.push({
        el: app.elementSelected,
        classes: [classStructure]
      });
    else if (!isInAssociated.classes.find(v => v.name == classStructure.name))
      isInAssociated.classes.push(classStructure);
    app.core.htmlMatch.removeClass(app.elementSelected, className);
  }
  var classAttribute = modelAttributes.attributes.find(v => v.name == "class");
  classAttribute.value = app.elementSelected.getAttribute("class");
  attrsTemplate.set("", modelAttributes);
  flagForInternalModifications = true;
});
newClassForm.addEventListener("submit", e => {
  e.preventDefault();
  try {
    app.core.htmlMatch.addClass(app.elementSelected, classesModel.newClassName);
  } catch (e) {
    classesModel.classinvalid = "";
    classesModel.classinvalid_phrase = e;
    classesTemplate.set("", classesModel);
    return;
  }
  setClasses();
  flagForInternalModifications = true;
});