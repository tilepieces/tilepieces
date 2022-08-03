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