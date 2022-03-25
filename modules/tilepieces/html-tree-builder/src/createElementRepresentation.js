function createElementRepresentation(target) {
  var closure = target.nodeName.match(voidElementsRegex) ? "/&gt;" : "&gt;";
  var attrRepr = createAttributes(target.attributes);
  return `<span>&lt;</span><span class="html-tree-builer__tag-span">` +
    `${target.tagName.toLowerCase()}</span>${attrRepr}` +
    `<span class="html-tree-builer__tag-span">${closure}</span>`;
}