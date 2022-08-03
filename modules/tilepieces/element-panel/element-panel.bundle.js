const opener = window.opener || window.parent;
window.opener = opener;
const app = opener.tilepieces;
const alertDialog = opener.alertDialog;
window.tilepieces = app;
window.TT = opener.TT;
const copyButton = document.getElementById("copy-button");
const moveButton = document.getElementById("move-button");
const copyMoveAction = "";
const classesInCss = document.getElementById("classes-in-css");
const elementSumSection = document.getElementById("element-sum");
const insidePath = document.getElementById("inside-path");
const wrapper = document.getElementById("wrapper");
let mainTab = tilepieces_tabs({
  el: document.getElementById("tabs")
});
let pathTab = tilepieces_tabs({
  el: elementSumSection,
  noAction: true
});
/* attributes view */
const attributesView = document.getElementById("attributes");
const addAttrButton = document.getElementById("add-attribute");
const delNodeAttribute = document.getElementById("remove-element");
let attributeSelected;
let elementToChange; // it's not guaranteed that app.elementSelected is the same on change event
let elementToChangeTarget; // it's not guaranteed that the target will be the same on change
let modelAttributes = {
  attributes: [],
  nodeName: "",
  isVisible: "none"
};
let attrsTemplate = new opener.TT(attributesView, modelAttributes, {
  interpolation: /\$\{\{([\s\S]+?)\}\}/
});
/* interfaces */
const interfacesAssociatedSection = document.getElementById("component-interface");
let componentsModel = {
  interfacesAssociated: "",
  interfaces: []
};
let componentsTemplate = new opener.TT(interfacesAssociatedSection, componentsModel);


const classes = document.getElementById("classes");
let classesModel = {
  classes: []
};
let classesTemplate = new opener.TT(classes, classesModel, {
  interpolation: /\$\{\{([\s\S]+?)\}\}/
});
let associatedClasses = []; // global classes where to store references of removed classes
let flagForInternalModifications; // we rely on mutationObserver to track changes.
let newClassForm = document.getElementById("new-class");

const childrenElementUL = document.querySelector("#children ul");

const childrenGrabberSVG =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><g><g><g><path style="fill:#727272;" d="M17.5,8.4c-0.4,0-0.7-0.1-1-0.4L12,3.4L7.5,7.8C7,8.4,6.1,8.4,5.6,7.8C5,7.3,5,6.4,5.6,5.9L11,0.5c0.5-0.5,1.4-0.5,1.9,0L18.4,6C19,6.6,19,7.4,18.4,8C18.2,8.2,17.8,8.4,17.5,8.4z"/></g><g><path style="fill:#727272;" d="M12,11c-0.8,0-1.4-0.6-1.4-1.4l0-8.2c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4l0,8.2C13.4,10.4,12.8,11,12,11z"/></g></g><g><g><path style="fill:#727272;" d="M6.5,15.6c0.4,0,0.7,0.1,1,0.4l4.5,4.6l4.5-4.5c0.5-0.5,1.4-0.5,1.9,0c0.5,0.5,0.5,1.4,0,1.9L13,23.5c-0.5,0.5-1.4,0.5-1.9,0L5.6,18C5,17.4,5,16.6,5.6,16C5.8,15.8,6.2,15.6,6.5,15.6z"/></g><g><path style="fill:#727272;" d="M12,13c0.8,0,1.4,0.6,1.4,1.4l0,8.2c0,0.8-0.6,1.4-1.4,1.4c-0.8,0-1.4-0.6-1.4-1.4l0-8.2C10.6,13.6,11.2,13,12,13z"/></g></g></g></svg>`


const tagComponents = [{
  path: "tag-components/TABLE",
  name: "TABLE",
  selector: "table",
  interface: "interface.html",
  specificity: 1
}];
function assignComponentsToElement(el) {
  if ([1].indexOf(el.nodeType) == -1)
    el = el.parentNode;
  var comps = [];
  for (var k in app.localComponentsFlat) {
    var v = app.localComponentsFlat[k];
    var selector = v.selector || `[${app.componentAttribute}="${v.name}"]`;
    if (v.interface && selector && el.matches(selector)) {
      var componentBundle = Object.assign({}, v);
      componentBundle.specificity = cssSpecificity(selector);
      componentBundle.path = v.path;
      comps.push(v)
    }
  }
  return comps.concat(tagComponents.filter(v => el.matches(v.selector)))
    .sort((a, b) => b.specificity - a.specificity)
}
childrenElementUL.addEventListener("click", e => {
  if (e.target.classList.contains("children-grabber"))
    return;
  var link = e.target.closest("li");
  if (!link)
    return;
  var el = app.elementSelected.children[link.dataset.index];
  app.core.selectElement(el);
});
childrenElementUL.addEventListener("mousemove", e => {
  var link = e.target.closest("li");
  if (!link) {
    app.highlight = null;
    return;
  }
  app.highlight = app.elementSelected.children[link.dataset.index];
});
childrenElementUL.addEventListener("mouseout", e => {
  app.highlight = null;
});

const dragList = __dragList(childrenElementUL, {
  handlerSelector: ".children-grabber",
  convalidate: function (el) {
    if (el.querySelector(".children-grabber")) {
      return true
    }
  }
});
dragList.on("move", e => {
  var nodes = e.target;
  for (var i = nodes.length - 1; i >= 0; i--) {
    var node = nodes[i];
    var index = +node.dataset.index;
    var el = app.elementSelected.children[index];
    if (e.prev) {
      var indexP = +e.prev.dataset.index;
      var prevEl = app.elementSelected.children[indexP];
      app.core.htmlMatch.move(prevEl, el, "after");
    } else {
      var indexN = +e.next.dataset.index;
      var nextEl = app.elementSelected.children[indexN];
      app.core.htmlMatch.move(nextEl, el, "before");
    }
  }
  [...childrenElementUL.children].forEach((v, i) => v.dataset.index = i);
})
insidePath.addEventListener("click", e => {
  var link = e.target.closest("a");
  if (!link)
    return;
  var el = app.cssSelectorObj.composedPath[link.dataset.index];
  app.core.selectElement(el);
});
insidePath.addEventListener("mousemove", e => {
  var link = e.target.closest("a");
  if (!link) {
    app.highlight = null;
    return;
  }
  app.highlight = app.cssSelectorObj.composedPath[link.dataset.index];
});
insidePath.addEventListener("mouseout", e => {
  app.highlight = null;
});

opener.addEventListener("deselect-element", e => {
  wrapper.setAttribute("hidden", "");
  elementSumSection.style.display = "none";
});
opener.addEventListener("WYSIWYG-start", e => {
  wrapper.setAttribute("hidden", "");
  elementSumSection.style.display = "none";
});
opener.addEventListener("WYSIWYG-end", () => {
  if (app.elementSelected) {
    wrapper.removeAttribute("hidden");
    elementSumSection.style.display = "block";
  }
});
opener.addEventListener("content-editable-end", () => {
});
opener.addEventListener("frame-unload", () => {
  wrapper.setAttribute("hidden", "");
  elementSumSection.style.display = "none";
});

function onSelected(dontSetInterfaces) {
  if (app.elementSelected.nodeType == 1) {
    wrapper.removeAttribute("hidden");
    setAttrsTemplate(app.elementSelected, app.selectorObj.match);
    !dontSetInterfaces && setInterfaces();
    setClasses();
  } else wrapper.setAttribute("hidden", "");
}

if (app.elementSelected) {
  onSelected()
}
opener.addEventListener("highlight-click", () => onSelected());
attributesView.addEventListener("dropzone-dropping", onDropFiles, true);

opener.addEventListener("tilepieces-mutation-event", e => {
  var mutationList = e.detail.mutationList;
  console.log("[element panel log mutationList and flagForInternalModifications]->", mutationList, flagForInternalModifications);
  if (flagForInternalModifications) {
    flagForInternalModifications = false;
    return;
  }
  var findAttributeMutation, removedNode, childrenList;
  mutationList.forEach(mutation => {
    if (mutation.type == "childList" &&
      mutation.target == app.elementSelected)
      childrenList = true;
    if (mutation.type == "attributes" &&
      mutation.target == app.elementSelected)
      findAttributeMutation = true;
    mutation.removedNodes.forEach(v => {
      if (v == app.elementSelected)
        removedNode = true;
    });
  });
  if (removedNode) {
    wrapper.setAttribute("hidden", "");
  } else if (childrenList) {
    setChildrenElements();
  } else if (findAttributeMutation)
    onSelected(true);
})
window.addEventListener("window-popup-open", e => {
});
window.addEventListener("window-popup-close", e => {
  //window.location.reload();
});
function setAttrsTemplate(target, match) {
  var tagName = target.tagName;
  modelAttributes.attributes = [...target.attributes].reverse().map((a, i) => {
    var name = a.nodeName;
    var value = a.nodeValue;
    var parentNode = target.parentNode;
    var isPackageAttribute = name == app.componentAttribute.toLowerCase();
    var packageObj = isPackageAttribute ? app.localComponentsFlat[value] : null;
    var packageLink = packageObj ? (packageObj.path + "/" + packageObj.html).replace(/\/+/g,"/") : "";
    var classSrc = (
      tagName.match(/^(VIDEO|AUDIO|IMG)$/) ||
      (parentNode?.tagName?.match(/^(VIDEO|AUDIO|IMG)$/) && tagName == "SOURCE")
    ) &&
    name.toLowerCase() == "src" ?
      "src-box" :
      isPackageAttribute ?
      "component-box" :
      "";
    var disabled = !match.match || match.match.getAttribute(name) != value ? "disabled" : "";
    return {
      name,
      value,
      disabled,
      index: i,
      classSrc,
      packageLink,
      dropzone: classSrc && !disabled ? "data-dropzone" : ""
    }
  });
  modelAttributes.nodeName = tagName;
  modelAttributes.nodenamedisabled = match.match && !tagName.match(/(HTML|BODY|HEAD)/) ? "" : "disabled";
  modelAttributes.isVisible = "block";
  modelAttributes.notmatch = !match.match || !match.attributes || !match.HTML ? "" : "hidden";
  modelAttributes.not_matching_phrase = !match.match ? "cannot find the element in the original tree" :
    !match.attributes && !match.HTML ? "A match was found for the element, but both HTML and attributes are different." :
      !match.attributes ? "A match was found for the element, but attributes are different." :
        !match.HTML ? "A match was found for the element, but HTML is different." : "";
  modelAttributes.nodenameinvalid = "hidden";
  attrsTemplate.set("", modelAttributes);
  addAttrButton.disabled = false;
  attributeSelected && attributeSelected.parentNode.classList.remove("attr-sel");
  //
  insidePath.innerHTML = app.cssSelectorObj.composedPath
    .reduce((filtered, v, i) => {
      if (v.tagName && i > 0)
        filtered.push(`<a href='#' data-index='${i}'>${app.utils.elementSum(v)}</a>`);
      return filtered
    }, []).reverse().join("");
  elementSumSection.style.display = "block";
  setChildrenElements();
}
function setChildrenElements() {
  childrenElementUL.innerHTML = [...app.elementSelected.children]
    .map((v, i, a) => {
      var isNodeMatch = !v.tagName.match(/^(HTML|BODY|HEAD|THEAD|TBODY|TFOOT)$/) && app.core.htmlMatch.find(v);
      var grabber = isNodeMatch && a.length > 1 ? `<span class="children-grabber">${childrenGrabberSVG}</span>` : "";
      return `<li data-index=${i}>${grabber}<a href='#'>${app.utils.elementSum(v)}</a></li>`
    })
    .join("");
}
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
attributesView.addEventListener("click", e => {
  if (!e.target.closest(".go-to-component"))
    return;
  e.preventDefault();
  app.setFrame(e.target.dataset.href);
})

attributesView.addEventListener("nodeName", e => {
  if (app.elementSelected != elementToChange) {
    console.warn("[element panel] returning from nodeName change, because app.elementSelected != elementToChange")
    return;
  }
  var currentElement = app.elementSelected;
  var newNodeName = e.detail.target.value.toUpperCase();
  var composedPath = app.selectorObj.composedPath.slice(1, app.selectorObj.composedPath.length);
  var isNotAdmitted = app.utils.notAdmittedTagNameInPosition(newNodeName, composedPath);
  if (isNotAdmitted) {
    modelAttributes.nodenameinvalid = "";
    modelAttributes.node_name_invalid_explanation = "Node " + newNodeName + " is invalid in this position";
    attrsTemplate.set("", modelAttributes);
    return;
  }
  // check for all nodes under if they can stay with the new tag.
  var treeWalker = document.createTreeWalker(
    app.elementSelected,
    NodeFilter.SHOW_ELEMENT
  );
  var currentNode = treeWalker.currentNode;
  while (currentNode) {
    if(currentNode !== app.elementSelected){
      var swap = currentNode.parentNode;
      var subComposedPath = [];
      while (swap) {
        subComposedPath.push(swap);
        swap = swap.parentNode;
      }
      var tagName = currentNode.tagName
      if (app.utils.notAdmittedTagNameInPosition(tagName, subComposedPath)) {
        modelAttributes.nodenameinvalid = "";
        modelAttributes.node_name_invalid_explanation = "This node has a tag called " + tagName + " which cannot have " + newNodeName + " as parent";
        attrsTemplate.set("", modelAttributes);
        return;
      }
    }
    currentNode = treeWalker.nextNode();
  }
  modelAttributes.nodenameinvalid = "hidden";
  attrsTemplate.set("", modelAttributes);
  var newNode = currentElement.ownerDocument.createElement(newNodeName);
  for (var i = 0, l = currentElement.attributes.length; i < l; ++i) {
    var nodeName = currentElement.attributes.item(i).nodeName;
    var nodeValue = currentElement.attributes.item(i).nodeValue;
    newNode.setAttribute(nodeName, nodeValue);
  }
  [...currentElement.childNodes].forEach(c => newNode.appendChild(c));
  app.core.htmlMatch.replaceWith(currentElement, newNode);
  newNode.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
});
document.getElementById("node-name").addEventListener("blur", e => {
  if (modelAttributes.nodenameinvalid == "") {
    modelAttributes.nodenameinvalid = "hidden";
    modelAttributes.nodeName = app.elementSelected.nodeName;
    attrsTemplate.set("", modelAttributes);
  }
})
function onDropFiles(e) {
  e.preventDefault();
  var dropzone = e.detail.target;
  var file = e.detail.files[0];
  if (!file)
    return;
  var tagName = modelAttributes.nodeName;
  var tagParentName = app.elementSelected.parentNode.tagName;
  var isSOURCE = tagName == "SOURCE";
  var isIMG = (tagName == "IMG" || (isSOURCE && tagParentName == "IMG")) &&
    file.type.startsWith("image/");
  var isVIDEO = (tagName == "VIDEO" || (isSOURCE && tagParentName == "VIDEO")) &&
    file.type.startsWith("video/");
  var isAUDIO = (tagName == "AUDIO" || (isSOURCE && tagParentName == "AUDIO")) &&
    file.type.startsWith("audio/");
  var allowed = isIMG || isVIDEO || isAUDIO;
  if (allowed) {
    app.utils.processFile(file).then(res => {
      var sel = app.elementSelected;
      app.core.htmlMatch.setAttribute(sel, "src", res);
      if (isVIDEO || isAUDIO)
        isSOURCE ? sel.parentNode.load() : sel.load()
    })
  }
}
attributesView.addEventListener("click", e => {
  if (!e.target.closest(".search-button"))
    return;
  var tagName = modelAttributes.nodeName;
  var tagParentName = app.elementSelected.parentNode.tagName;
  var isSOURCE = tagName == "SOURCE";
  var typeSearch = isSOURCE ? tagParentName.toLowerCase() : tagName.toLowerCase();
  var dialogSearch = opener.dialogReader(typeSearch);
  dialogSearch.then(dialog => {
    dialog.on("submit", src => {
      var sel = app.elementSelected;
      app.core.htmlMatch.setAttribute(isSOURCE ? sel.parentNode : sel, "src", src);
    })
  })
})

delNodeAttribute.addEventListener("click", e => {
  app.core.htmlMatch.removeChild(app.elementSelected);
  if (app.multiselected) {
    var index = app.multiselections.findIndex(v => v.el == app.elementSelected);
    app.removeItemSelected(index);
  } else
    app.core.deselectElement();
});
interfacesAssociatedSection.addEventListener("interfaceAssociated", e => {
  console.log("[interfaceAssociated]", e, e.detail, e.detail.target.value);
  // componentsModel.interfaceAssociated is the last value;
  var exSelectedIndex = componentsModel.interfaceAssociated ? componentsModel.interfaces.findIndex(v => v.name == componentsModel.interfaceAssociated) : 0;
  componentsModel.interfaces[exSelectedIndex].selected = "";
  var newSelected = componentsModel.interfaces.find(v => v.name == e.detail.target.value);
  newSelected.selected = "selected";
  componentsTemplate.set("", componentsModel);
})