function setInterfaces() {
  componentsTemplate.set("interfaces", []);
  cacheSelector = app.elementSelected;
  var componentsToElement = assignComponentsToElement(app.elementSelected);
  var interfaces = componentsToElement
    .map((value, i) => {
      if (i == 0 && componentsModel.interfaceAssociated != value.name) {
        componentsModel.interfaceAssociated = value.name;
      }
      var isTagComponent = tagComponents.find(v => v.name == value.name);
      var interfacePath = isTagComponent ? value.path + "/" + value.interface :
        ("/" + tilepieces.frameResourcePath() + "/" + value.path + "/" + value.interface).replace(/\/\//g, "/");
      return {
        interface: interfacePath,
        name: value.name
      };
    });
  var interfacesInherited = app.selectorObj.composedPath.reduce((acc, v) => {
    if (v == app.elementSelected)
      return acc;
    // https://stackoverflow.com/a/385427
    if (!(typeof v == "object" && "nodeType" in v &&
      v.nodeType === 1 && v.cloneNode))
      return acc;
    var arr = assignComponentsToElement(v);
    arr = arr.reduce((accu, value, index) => {
      // just one interface for element.
      var foundInInterface = interfaces.find(i => i.name == value.name);
      var foundInAccu = acc.find(a => a.name == value.name);
      if (!foundInInterface && !foundInAccu) {
        var accuIndex = index + interfaces.length;
        var isTagComponent = tagComponents.find(v => v.name == value.name);
        var absoluteStart = isTagComponent ? "" : "/";
        var interfacePath = isTagComponent ? value.path + "/" + value.interface :
          ("/" + tilepieces.frameResourcePath() + "/" + value.path + "/" + value.interface).replace(/\/\//g, "/");
        accu.push(
          {
            interface: interfacePath,
            name: value.name
          }
        );
      }
      return accu;
    }, []);
    return acc.concat(arr);
  }, []);
  interfaces = interfaces
    .concat(interfacesInherited)
    .map((v, index) => Object.assign(v, {index, selected: index == 0 ? "selected" : ""}));
  if (!interfaces) {
    interfacesAssociatedSection.classList.add("hidden");
  } else
    interfacesAssociatedSection.classList.remove("hidden");
  // if they are equal, it means that there is no need to update interface
  /*
    if(JSON.stringify(componentsModel.interfaces) == JSON.stringify(interfaces))
        return;

   */
  componentsTemplate.set("interfaces", interfaces);
}