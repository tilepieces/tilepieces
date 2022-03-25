window.cssMatcher = function (DOMEl, stylesheets) {
  var cssMatches = [];
  var pseudoElements = [];
  var pseudoStates = [];
  var collectedRules = [];
  // get ancestors for inherited properties
  var ancestor = DOMEl,
    ancestors = [],
    DOMElWin = DOMEl.ownerDocument.defaultView;
  // get ancestors styles
  while (ancestor = ancestor.parentElement) {
    var ancestorStyle = null;
    if (ancestor.style.length) {
      var properties = parseStyleAttribute(ancestor, true);
      if (properties && properties.length)
        ancestorStyle = {
          rule: ancestor,
          isStyle: true,
          properties: properties,
          inheritedProps: true
        };
    }
    ancestors.push({
      ancestor: ancestor,
      ancestorStyle: ancestorStyle,
      matches: []
    });
  }

  function processRules(rules, style, styles) {
    var rulesLength = rules.length;
    for (var r = 0; r < rulesLength; r++) {
      var rule = rules[r];
      switch (rule.constructor.name) {
        case "CSSImportRule":
          if (DOMElWin.matchMedia(rule.media.mediaText).matches) {
            /*
            var f = styles.find(v=>v.href==rule.href);
            if(f && f.type!="external")
                processRules(rule.styleSheet.cssRules,style,styles);
             */
            try {
              processRules(rule.styleSheet.cssRules, style, styles)
            } catch (e) {
            }

          }
          break;
        case "CSSStyleRule": // rule
          var match;
          var pseudosEl = findPseudoElements(DOMEl, rule, style);
          if (pseudosEl) {
            pseudoElements.unshift(pseudosEl);
            //break;
          }
          var pseudosStates = findPseudoStates(DOMEl, rule, style);
          if (pseudosStates) {
            pseudoStates.unshift(pseudosStates);
            //break;
          }
          var selector = rule.selectorText;
          try {
            match = DOMEl.matches(selector)
          } catch (e) {
            break;
          }
          if (match && collectedRules.indexOf(rule)===-1) {
            cssMatches.unshift(parsingRule(DOMEl, rule, style));
            collectedRules.push(rule);
          }
          ancestors.forEach(ancestor => {
            if (ancestor.ancestor.matches(selector) && collectedRules.indexOf(rule)===-1) {
              var ancestorInheritedRules = parsingRule(ancestor.ancestor, rule, style, true);
              if(ancestorInheritedRules) {
                ancestor.matches.unshift(ancestorInheritedRules);
                collectedRules.push(rule)
              }
            }
          });
          break;
        case "CSSMediaRule":// @media
          if (DOMElWin.matchMedia(rule.conditionText).matches)
            processRules(rule.cssRules, style);
          break;
        case "CSSSupportsRule":// @supports
          if (DOMElWin.CSS && DOMElWin.CSS.supports &&
            DOMElWin.CSS.supports(rule.conditionText))
            processRules(rule.cssRules, style);
          break;
        default:// other cases not handled
          break;
      }
    }
  }

  function init(styles) {
    for (var i = 0; i < styles.length; i++) {
      var thisStylesheet = styles[i].sheet;
      if (thisStylesheet.disabled)
        continue;
      try {
        if (thisStylesheet.media.length &&
          !DOMElWin.matchMedia(thisStylesheet.media.mediaText).matches)
          continue;
      } catch (e) {
        console.warn("Access denied to", thisStylesheet);
        continue;
      }
      var rulesLength = thisStylesheet.cssRules ? thisStylesheet.cssRules.length : 0;
      var rules = thisStylesheet.cssRules;

      rulesLength && processRules(rules, styles[i], styles)
    }
  }

  init(stylesheets);
  // create style property for element
  cssMatches.unshift({
    rule: DOMEl,
    isStyle: true,
    properties: DOMEl.style.length ? parseStyleAttribute(DOMEl) : [],
    inheritedProps: false,
    type: "inline"
  });
  cssMatches.sort((a, b) => b.specificity - a.specificity);
  pseudoElements.sort((a, b) => b.specificity - a.specificity);
  pseudoStates.sort((a, b) => b.specificity - a.specificity);
  ancestors.map(anc => {
    anc.matches.sort((a, b) => b.specificity - a.specificity);
    return anc;
  });
  return {
    cssMatches,
    ancestors,
    matchStyle: function (styleNamecss, noAncestors) {
      return matchStyle(styleNamecss, cssMatches, ancestors, noAncestors);
    },
    properties: createProps(cssMatches),
    pseudoElements,
    pseudoStates,
    getCssTextProperties,
    isShortHand
  };
};
window.getCssTextProperties = getCssTextProperties;
window.isCssShortHand = isShortHand;
window.inheritedProperties = inheritedProperties;
