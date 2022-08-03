function setClasses() {
  var target = app.elementSelected;
  var classesTokens = target.classList;
  var iterator = classesTokens.values();
  classesModel.classes = [];
  for (var name of iterator) {
    classesModel.classes.push({
      name,
      checked: true
    });
  }
  var associated = associatedClasses.find(v => v.el == target);
  if (associated)
    classesModel.classes = classesModel.classes.concat(associated.classes);
  classesModel.classes.forEach((v, i) => v.index = i);
  var match = app.selectorObj.match;
  classesModel.canadd = !match.match ||
  match.match.getAttribute("class") != app.elementSelected.getAttribute("class") ?
    "disabled" : "";
  classesModel.newClassName = "";
  classesModel.classinvalid = "hidden";
  classesTemplate.set("", classesModel);
  classesInCss.innerHTML = "";
  app.core.styles.classes.forEach(v=>{
    if(app.elementSelected.classList.contains(v))
      return;
    var newOptionElement = document.createElement("option");
    newOptionElement.textContent = v;
    classesInCss.append(newOptionElement);
  })
}