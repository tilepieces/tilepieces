componentSection.addEventListener("click", async e => {
  var target = e.target;
  var t = target.closest(".components-children")
  if (!t)
    return;
  var opened = t.classList.toggle("open");
  var tParent = t.parentNode;
  if (!opened) {
    var previous = tParent.querySelector("ul");
    previous && previous.remove();
    return;
  }
  var component = t.__component;
  var childrens = component.components;
  var doc = t.getRootNode();
  var newList = doc.createElement("ul");
  for (var childName in childrens) {
    var childComponentData = childrens[childName];
    var model = {component: childComponentData};
    var li = componentChildTemplate.content.cloneNode(true);
    new opener.TT(li, model);
    newList.appendChild(li);
  }
  tParent.appendChild(newList);
})