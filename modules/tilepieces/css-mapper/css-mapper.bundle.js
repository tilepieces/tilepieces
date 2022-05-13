(() => {
  function conditionalMap(rule) {
    var conditionText = rule.cssText.split("{")[0].trim();
    var inheritedConditionText = "";
    var parentRule = rule.parentRule;
    while (parentRule) {
      inheritedConditionText = (inheritedConditionText ? inheritedConditionText + ", " : "") +
        parentRule.cssText.split("{")[0].trim();
      parentRule = parentRule.parentRule;
    }
    return {conditionText, inheritedConditionText, rule}
  }

  window.conditionalRuleMap = conditionalMap;
  var doc = document.implementation.createHTMLDocument("");
  let cache = [];

  async function createStyle(style) {
    var ajaxReq;
    var alreadyParsed = cache.find(v => v.href && v.href == style.href);
    if (alreadyParsed && alreadyParsed.sheet)
      return alreadyParsed;
    else if (alreadyParsed && !alreadyParsed.sheet)
      return;
    try {
      ajaxReq = await fetch(style.href);
      if (ajaxReq.status != 200)
        throw "404"
    } catch (e) {
      cache.push({
        href: style.href,
        sheet: null,
        type: "external"
      });
      return;
    }
    var cssText = await ajaxReq.text();
    var innerStyle = doc.createElement("style");
    innerStyle.appendChild(doc.createTextNode(cssText));
    doc.head.appendChild(innerStyle);
    var sheet = {
      href: style.href,
      sheet: innerStyle.sheet,
      type: "external"
    };
    cache.push(sheet);
    return sheet;
  }

  let trimClassGenerator = /\s|,|\./g;
  let trimIdGenerator = /\s|,|\./g;

  async function cssMapper(doc, idGenerator, classGenerator) {
    var returnObj = {
      styleSheets: [],
      fonts: [],
      fontDeclarations: [],
      animations: [],
      parseRules,
      mediaQueries: [],
      conditionalGroups: [],
      idGenerator: idGenerator ? new RegExp(`#${idGenerator}\\d+(\\s|$|,)`) : idGenerator,
      classGenerator: classGenerator ? new RegExp(`\\.${classGenerator}\\d+(\\s|$|,)`) : classGenerator,
      idIndex: 0,
      classIndex: 0
    };
    for (var i = 0; i < doc.styleSheets.length; i++) {
      var style = doc.styleSheets[i];
      var rules;
      try {
        rules = style.cssRules;
      } catch (e) {
        style = await createStyle(style);
        if (style)
          rules = style.sheet.cssRules;
        else
          continue;
      }
      var media = style.media || style.sheet.media;
      if (media && media.length) {
        returnObj.mediaQueries.push({rule: style, children: []});
      }
      await parseRules(rules, returnObj);
      returnObj.styleSheets.push({
        href: style.href,
        sheet: style.sheet || style,
        type: style.type
      });
    }
    return returnObj;
  }

  window.cssMapper = cssMapper;
  let fontModelMap = {
    "font-family": "fontFamily",
    "font-weight": "fontWeight",
    "font-style": "fontStyle",
    "font-display": "fontDisplay",
    "unicode-range": "unicodeRange",
    "font-stretch": "fontStretch",
    "font-variant": "fontVariant",
    "font-feature-settings": "fontFeatureSettings",
    "font-variation-settings": "fontVariationSettings"
  }

  function isChildOfConditional(conditionalRules, rule) {
    var isChildRule;
    for (var i = 0; i < conditionalRules.length; i++) {
      var cond = conditionalRules[i];
      isChildRule = isChildOfConditionalRecursion(cond,
        rule.parentRule || rule.parentStyleSheet);
      if (isChildRule)
        break;
    }
    return isChildRule;
  }

  function isChildOfConditionalRecursion(cond, rule) {
    if (cond.rule == rule)
      return cond;
    var r;
    for (var i = 0; i < cond.children.length; i++) {
      r = isChildOfMediaQueryRecursion(cond.children[i], rule);
      if (r)
        break;
    }
    return r;
  }

  function isChildOfMediaQuery(mediaQueries, rule) {
    var isChildRule;
    for (var i = 0; i < mediaQueries.length; i++) {
      var mQ = mediaQueries[i];
      isChildRule = isChildOfMediaQueryRecursion(mQ,
        rule.parentRule || rule.parentStyleSheet);
      if (isChildRule)
        break;
    }
    return isChildRule;
  }

  function isChildOfMediaQueryRecursion(mediaQuery, rule) {
    if (mediaQuery.rule == rule)
      return mediaQuery;
    var r;
    for (var i = 0; i < mediaQuery.children.length; i++) {
      r = isChildOfMediaQueryRecursion(mediaQuery.children[i], rule);
      if (r)
        break;
    }
    return r;
  }

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
        default:
          if (rule.cssRules) {
            returnObj.conditionalGroups.push(conditionalMap(rule));
            parseRules(rule.cssRules, returnObj)
          }
      }
    }
  }

})();