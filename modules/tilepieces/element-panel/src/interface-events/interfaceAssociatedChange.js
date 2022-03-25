interfacesAssociatedSection.addEventListener("interfaceAssociated", e => {
  console.log("[interfaceAssociated]", e, e.detail, e.detail.target.value);
  // componentsModel.interfaceAssociated is the last value;
  var exSelectedIndex = componentsModel.interfaceAssociated ? componentsModel.interfaces.findIndex(v => v.name == componentsModel.interfaceAssociated) : 0;
  componentsModel.interfaces[exSelectedIndex].selected = "";
  var newSelected = componentsModel.interfaces.find(v => v.name == e.detail.target.value);
  newSelected.selected = "selected";
  componentsTemplate.set("", componentsModel);
})