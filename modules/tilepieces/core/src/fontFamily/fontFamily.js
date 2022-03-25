window.addEventListener("cssMapper-changed", e => {
  var styleParsed = e.detail.styles;
  var defaults = tilepieces.cssDefaultValues["font-family"];
  styleParsed.fontDeclarations.forEach(f => {
    if (!e.detail.fontAlreadyDeclared.find(v => v == f) &&
      !defaults.find(v => v == f))
      e.detail.fontAlreadyDeclared.push(f);
  });
  styleParsed.fonts.forEach(f => {
    if (f.mapped.fontFamily &&
      !e.detail.fontAlreadyDeclared.find(v => v == f.mapped.fontFamily) &&
      !defaults.find(v => v == f.mapped.fontFamily) &&
      e.detail.currentDocument.fonts.check("12px " + f.mapped.fontFamily))
      e.detail.fontAlreadyDeclared.push(f.mapped.fontFamily);
  });
  e.detail.fontSuggestions = e.detail.fontAlreadyDeclared.concat(defaults);
});