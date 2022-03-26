(() => {
  /* test code */
  const opener = window.opener || window.parent;
  let app = opener.tilepieces;
  let doc = app.core.currentDocument;
  let styleSheet = doc.styleSheets[0];
  let ruleExample = styleSheet.cssRules[0];
  let ruleA = styleSheet.cssRules[1];
  let ruleB = styleSheet.cssRules[2];
  let slideinFrom = styleSheet.cssRules[3].cssRules[0];
  let slideinTo = styleSheet.cssRules[3].cssRules[1];
  let backgroundColorFrom = styleSheet.cssRules[4].cssRules[0];
  let backgroundColorTo = styleSheet.cssRules[4].cssRules[1];
  let appView1 = document.getElementById("app-view-1");
  let appView2 = document.getElementById("app-view-2");

  function mapPropers(v, i) {
    v.checked = true;
    v.disabled = "disabled";
    v.index = i;
    v.contenteditable = "contenteditable";
    v.autocomplete_suggestions = opener.tilepieces.cssDefaultProperties[v.property] || [];
    return v
  }

  let model1 = {
    cssDefaultProperties: opener.tilepieces.cssDefaultProperties,
    ruleA: {
      properties: opener.getCssTextProperties(ruleA.style.cssText).map(mapPropers),
      contenteditable: "contenteditable",
      isEditable: true,
      rule: ruleA
    },
    ruleExample: {
      properties: opener.getCssTextProperties(ruleExample.style.cssText).map(mapPropers),
      rule: ruleExample,
      isEditable: true,
      contenteditable: "contenteditable"
    },
    ruleB: {
      properties: opener.getCssTextProperties(ruleB.style.cssText).map(mapPropers),
      rule: ruleB,
      isEditable: true,
      contenteditable: "contenteditable"
    }
  };
  let model2 = {
    cssDefaultProperties: opener.tilepieces.cssDefaultProperties,
    slideinFrom: {
      properties: opener.getCssTextProperties(slideinFrom.style.cssText).map(mapPropers),
      rule: slideinFrom,
      isEditable: true,
      contenteditable: "contenteditable"
    },
    slideinTo: {
      properties: opener.getCssTextProperties(slideinTo.style.cssText).map(mapPropers),
      rule: slideinTo,
      isEditable: true,
      contenteditable: "contenteditable"
    },
    backgroundColorFrom: {
      properties: opener.getCssTextProperties(backgroundColorFrom.style.cssText).map(mapPropers),
      rule: backgroundColorFrom,
      isEditable: true,
      contenteditable: "contenteditable"
    },
    backgroundColorTo: {
      properties: opener.getCssTextProperties(backgroundColorTo.style.cssText).map(mapPropers),
      rule: backgroundColorTo,
      isEditable: true,
      contenteditable: "contenteditable"
    }
  }
  let t1 = new opener.TT(appView1, model1, {
    templates: [{
      name: "css-properties-list",
      el: document.getElementById("css-properties-list").content
    }]
  });
  let t2 = new opener.TT(appView2, model2, {
    templates: [{
      name: "css-properties-list",
      el: document.getElementById("css-properties-list").content
    }]
  });
  css_rule_modification({
    tilepiecesTemplate: t1,
    tilepiecesTemplateModel: model1,
    appView: appView1
  });
  inputCss(appView1);
  css_rule_modification({
    tilepiecesTemplate: t2,
    tilepiecesTemplateModel: model2,
    appView: appView2
  });
  inputCss(appView2);
})();