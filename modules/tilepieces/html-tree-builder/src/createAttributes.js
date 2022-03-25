function createAttributes(attrs) {
  var attrsTokens = [];
  var returnString = "";
  for (var i = 0; i < attrs.length; i++)
    attrsTokens[i] = `<span class="html-tree-builder-attribute" spellcheck="false">` +
      `<span class="attribute-key" data-key="${attrs[i].name}">${attrs[i].name}</span>` +
      `="<span class="attribute-value" data-value="${attrs[i].value}">${attrs[i].value}</span>"</span>`;

  returnString +=
    `<span class="html-tree-builder-attributes ${attrsTokens.length ? `` : `no-pad`}">
            ${attrsTokens.join("&nbsp;")}</span>`;
  return returnString;
}