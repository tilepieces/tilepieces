async function parseRules(rules, returnObj) {
  // SEARCHING FOR IMPORT, FONTS AND ANIMATIONS
  for (var rulei = 0; rulei < rules.length; rulei++) {
    var rule = rules[rulei];
    switch (rule.constructor.name) {
      case "CSSStyleRule":
        if (rule.style.fontFamily && !returnObj.fontDeclarations.includes(rule.style.fontFamily))
          returnObj.fontDeclarations.push(rule.style.fontFamily);
        if (returnObj.classGenerator) {
          var matchClassGenerator = rule.selectorText.match(returnObj.classGenerator);
          if (matchClassGenerator) {
            var number = matchClassGenerator[0].replace(/\s|,|\./g, "").match(/\d+/);
            if (!number) {
              console.error("[CSS PARSER - PARSE RULE] error finding classIndex");
              return
            }
            var n = Number(number[0]);
            if (n > returnObj.classIndex)
              returnObj.classIndex = n;
          }
        }
        if (returnObj.idGenerator) {
          var matchIdGenerator = rule.selectorText.match(returnObj.idGenerator);
          if (matchIdGenerator) {
            var number = matchIdGenerator[0].replace(/\s|,|#/g, "").match(/\d+/);
            if (!number) {
              console.error("[CSS PARSER - PARSE RULE] error finding idIndex");
              return
            }
            var n = Number(number[0]);
            if (n > returnObj.idIndex)
              returnObj.idIndex = n;
          }
        }
        break;
      case "CSSFontFaceRule":
        var mapped = {
          fontFamily: "",
          fontWeight: "",
          fontStyle: "",
          fontDisplay: "",
          unicodeRange: "",
          fontStretch: "",
          fontVariant: "",
          fontFeatureSettings: "",
          fontVariationSettings: "",
          src: ""
        };
        for (var i = 0; i < rule.style.length; i++) {
          var prop = rule.style[i];
          var propMapped = fontModelMap[prop] || prop;
          mapped[propMapped] = rule.style.getPropertyValue(rule.style[i])
        }
        returnObj.fonts.push({mapped, fontFaceRule: rule, cssText: rule.cssText});
        break;
      case "CSSKeyframesRule":
        returnObj.animations.push(rule);
        break;
      case "CSSImportRule":
        if (rule.media.length) {
          var isChildRule = isChildOfMediaQuery(returnObj.mediaQueries, rule);
          if (isChildRule)
            isChildRule.children.push({rule, children: []});
          else
            returnObj.mediaQueries.push({rule, children: []});
        }
        try {
          parseRules(rule.styleSheet.cssRules, returnObj);
        } catch (e) {
          var style = await createStyle(rule.styleSheet);
          if (style) {
            await parseRules(style.sheet.cssRules, returnObj);
            returnObj.styleSheets.push(style);
          }
        }
        break;
      case "CSSMediaRule":
        var isChildRule = isChildOfMediaQuery(returnObj.mediaQueries, rule);
        if (isChildRule)
          isChildRule.children.push({rule, children: []});
        else
          returnObj.mediaQueries.push({rule, children: []});
      case "CSSLayerBlockRule":
      default:
        if (rule.cssRules) {
          returnObj.conditionalGroups.push(conditionalMap(rule));
          parseRules(rule.cssRules, returnObj)
        }
    }
  }
}