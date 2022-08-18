(()=>{
function createProps(cssMatches) {
  var properties = {};
  cssMatches.forEach(cssR => {
    for (var i = 0; i < cssR.rule.style.length; i++) {
      var propKey = cssR.rule.style[i];
      var value = cssR.rule.style.getPropertyValue(propKey);
      var priority = cssR.rule.style.getPropertyPriority(propKey);
      var shortHand = isShortHand(propKey);
      var alreadySetted = properties[propKey] ||
        (shortHand && properties[shortHand]);
      if (!alreadySetted ||
        (priority == "important" && !alreadySetted.priority))
        properties[propKey] = {value, priority, rule: cssR.rule, type: cssR.type};
    }
    /* THIS VERSION HAS A PROBLEM WITH SHORTHAND VALUES ( EX margin, or border-top )
    var props = cssR.properties;
    for(var i = 0;i<props.length;i++){
        var propKey = props[i].property;
        var value = cssR.rule.style.getPropertyValue(propKey);
        var priority = cssR.rule.style.getPropertyPriority(propKey);
        var alreadySetted;
        var alreadySetted = properties[propKey] || properties[propKey.split("-")[0]];
        if(!alreadySetted)
            properties[propKey]={value,priority};
        else if(priority == "important" && !alreadySetted.priority)
            alreadySetted.value = value;
    }
    */
  });
  return properties;
}
/*
 /:{1,2}(?<name>[-\w\u{0080}-\u{FFFF}]+)(\([^)]*\))?/gu
 /:{1,2}(?<name>[-\w]+)(\([^)]*\))?/gu
 /(:hover)/g
 lea verou : parsel
 /::[a-z-]+|:before|:after|:first-letter|:first-line/
 */
// const mainPseudoRegex = /(:{1,2}before|:{1,2}after|:{1,2}first-letter|:{1,2}first-line|::marker|::selection|::placeholder)(?=$|,)/;
const mainPseudoRegex = /(:{1,2}before|:{1,2}after|:{1,2}first-letter|:{1,2}first-line|::[a-z-]+)(?=$|,)/;

function findPseudoElements(DOMEl, rule, style) {
  if (!rule.selectorText.match(mainPseudoRegex))
    return;
  var selectors = splitCssValue(rule.selectorText);
  var specificity = 0;
  var pseudos = [];
  selectors = selectors.map((v, i, a) => {
    var match = false;
    var pseudoMatch = v.match(mainPseudoRegex);
    if (pseudoMatch) {
      var withoutPseudo = v.replace(mainPseudoRegex, "").trim();
      try {
        if(withoutPseudo.endsWith(">"))
          withoutPseudo+="*";
        match = DOMEl.matches(withoutPseudo || "*");
      }
      catch(e){
        console.error("match pseudo element error:",withoutPseudo || "*");
      }
      if (match) {
        pseudos.push(pseudoMatch[0]);
        var spec = cssSpecificity(v);
        if (spec > specificity)
          specificity = spec;
      }
    }
    return {
      match,
      string: v,
      selectorText: `${i > 0 ? " " : ""}${v}${i < a.length - 1 ? "," : ""}`
    }
  });
  if (!pseudos.length)
    return;
  var properties = propertiesMap(getCssTextProperties(rule.style.cssText), false);
  return {
    rule: rule,
    specificity: specificity,
    selectors: selectors,
    properties: properties,
    inheritedProps: false,
    href: style.href,
    type: style.type,
    pseudos
  }
}
/*
 /:{1,2}(?<name>[-\w\u{0080}-\u{FFFF}]+)(\([^)]*\))?/gu
 /:{1,2}(?<name>[-\w]+)(\([^)]*\))?/gu
 /(:hover)/g
 /:hover(?=$|:)/g
 /(:hover|:active|:focus|:focus-within|:{1,2}before|:{1,2}after|::backdrop|:{1,2}first-letter|:{1,2}first-line|::marker|::selection|::placeholder)(?=$|:|\s|,)/g
 lea verou : parsel (https://github.com/LeaVerou/parsel)
 let specialPseudoMatch = [{
 regex: "::placeholder",
 allowedNodes: ["INPUT", "TEXTAREA"]
 }];
 */
const PSEUDOSTATES = /(:hover|:active|:focus|:focus-within|:visited|:focus-visible|:target)(?=$|:|\s|,)/g;

function findPseudoStates(DOMEl, rule, style) {
  if (!rule.selectorText.match(PSEUDOSTATES))
    return;
  var selectors = splitCssValue(rule.selectorText);
  var specificity = 0;
  var pseudos = [];
  selectors = selectors.map((v, i, a) => {
    v = v.trim();
    var match = false;
    var pseudoMatches = v.match(PSEUDOSTATES);
    if (pseudoMatches) {
      // .ekko-lightbox-nav-overlay a > :focus ( original .ekko-lightbox-nav-overlay a>:focus )
      var withoutPseudo = "";
      var m, index = 0, count = 0;
      while ((m = PSEUDOSTATES.exec(v))) {
        withoutPseudo += v.substring(index, m.index);
        index = m.index + m[0].length;
        var previousI = m.index - 1;
        if (previousI < 0 || v.charAt(previousI).match(/\s/)) {
          withoutPseudo += "*";
        }
        count++;
        if (count > 500000) {
          console.error("v,withoutPseudo,m,index ->", v, withoutPseudo, m, index);
          throw "error in parsing pseudostates";
        }
      }
      //var withoutPseudo = v.replace(PSEUDOSTATES,"").trim();
      try {
        if(withoutPseudo.endsWith(">"))
          withoutPseudo+="*";
        match = DOMEl.matches(withoutPseudo);
      }
      catch(e){
        console.error("match pseudo state error:",withoutPseudo);
      }
      if (match) {
        pseudoMatches.forEach(p => pseudos.indexOf(p) < 0 && pseudos.push(p));
        var spec = cssSpecificity(v);
        if (spec > specificity)
          specificity = spec;
      }
    }
    return {
      match,
      string: v,
      selectorText: `${i > 0 ? " " : ""}${v}${i < a.length - 1 ? "," : ""}`
    }
  });
  if (!pseudos.length)
    return;
  var properties = propertiesMap(getCssTextProperties(rule.style.cssText), false);
  return {
    rule: rule,
    specificity: specificity,
    selectors: selectors,
    properties: properties,
    inheritedProps: false,
    href: style.href,
    type: style.type,
    pseudos
  }
}
function getCssTextProperties(cssText) {
  var statements = [];
  var index = 0;
  var quoteRegex = /("[^"]*")/g, resultQuotes, indicesQuotes = [];
  while ((resultQuotes = quoteRegex.exec(cssText)))
    indicesQuotes.push({start: resultQuotes.index, end: resultQuotes.index + resultQuotes[0].length});
  var semicolonRegex = /;/g, resultSearch;
  while ((resultSearch = semicolonRegex.exec(cssText))) {
    var isInQuote = indicesQuotes.find(v => resultSearch.index > v.start && resultSearch.index < v.end);
    if (!isInQuote) {
      statements.push(cssText.substring(index, resultSearch.index));
      index = resultSearch.index + 1;
    }
  }
  return statements.reduce((filtered, option) => {
    var a = option.split(/:(.+)/);
    if (a[0] && a[1])
      filtered.push({
        property: a[0].trim(),
        value: a[1].trim()
      });
    return filtered
  }, []);
}
var inheritedProperties = /^\-\-|border-collapse|border-spacing|caption-side|^color|cursor|direction|empty-cells|font(?!-)|font-family|font-size|font-style|font-variant|font-weight|font-size-adjust|font-stretch|letter-spacing|line-height|list-style-image|list-style-position|list-style-type|list-style|orphans|overflow-wrap|quotes|tab-size|text-align|text-align-last|text-decoration-color|text-indent|text-justify|text-shadow|text-transform|visibility|white-space|widows|word-break|word-spacing|word-wrap/gi

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
          //
          if(selector.endsWith(">"))
            selector+="*";
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
        case "CSSLayerBlockRule"://@layer
          rule.cssRules && processRules(rule.cssRules, style);
          break;
        default:
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
  // TODO create a new array from matches with @layers, sorted by specificity order
  // TODO maybe this array could be directly valorized during process rules...
  cssMatches.sort((a, b) => b.specificity - a.specificity);
  pseudoElements.sort((a, b) => b.specificity - a.specificity);
  pseudoStates.sort((a, b) => b.specificity - a.specificity);
  ancestors.map(anc => {
    // TODO
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

function matchStyle(styleNamecss, cssMatches, ancestors, noAncestors = false) {
  var found, importantFound;
  for (var i = 0; i < cssMatches.length; i++) {
    var rule = cssMatches[i];
    var cssRule = rule.rule.style;
    if (cssRule[styleNamecss]) {
      if (!found)
        found = {
          rule: cssRule,
          value: cssRule[styleNamecss]
        };
      var property = rule.properties.find(v =>
        v.property == styleNamecss ||
        (shorthandProperties[v.property] && shorthandProperties[v.property].find(v => v == styleNamecss))
      );
      if (property && property.value.match(/!important/i))
        importantFound = {
          rule: cssRule,
          value: cssRule[styleNamecss]
        };
    }
    if (found && importantFound)
      break;
  }
  if (noAncestors)
    return importantFound || found;
  if (!found) {
    for (var k = 0; k < ancestors.length; k++) {
      var ruleAncestor = ancestors[k];
      if (ruleAncestor.ancestorStyle &&
        ruleAncestor.ancestorStyle.rule.style[styleNamecss]) {
        found = {
          rule: ruleAncestor.ancestorStyle.rule,
          value: ruleAncestor.ancestorStyle.rule.style[styleNamecss]
        };
        break;
      }
      if (!ruleAncestor.matches.length)
        continue;
      ruleAncestor.matches.sort((a, b) => b.specificity - a.specificity);
      found = ruleAncestor.matches.find(v => v.rule.style[styleNamecss]);
      if (found) {
        found = {
          rule: found.rule,
          value: found.rule.style[styleNamecss]
        };
        break;
      }
    }
  }
  return importantFound || found;
}
function parseStyleAttribute(domEl, isInherited) {
  var properties = [];
  var css = domEl.style.cssText.split(";");
  css.forEach(function (v) {
    if (!v.trim().length) return;
    var prop = v.split(/:(.+)/);
    properties.push({
      property: prop[0].trim(),
      value: prop[1].trim()
    });
  });
  return propertiesMap(properties, isInherited);
}
function parsingRule(DOMEl, rule, style, inherited) {
  var selectors = splitCssValue(rule.selectorText);
  var properties = propertiesMap(getCssTextProperties(rule.style.cssText), inherited);
  if (!properties)
    return null;
  var specificity = 0;
  selectors = selectors.map((v, i, a) => {
    var match = DOMEl.matches(v);
    if (match) {
      var spec = cssSpecificity(v);
      if (spec > specificity)
        specificity = spec;
    }
    return {
      match: match,
      string: v,
      selectorText: `${i > 0 ? " " : ""}${v}${i < a.length - 1 ? "," : ""}`
    }
  });
  return {
    rule: rule,
    specificity: specificity,
    selectors: selectors,
    properties: properties,
    inheritedProps: inherited,
    href: style.href,
    type: style.type
  }
}
function propertiesMap(properties, inherited) {
  properties = properties.map((v) => {
    if (typeof v.property === "undefined")
      return;
    var isInherited = inherited && v.property.match(inheritedProperties);
    return {
      property: v.property,
      value: v.value,
      isInherited: !!isInherited
    };
  });
  return properties;
}
// https://github.com/gilmoreorless/css-shorthand-properties/blob/master/index.js
var shorthandProperties = {
  // CSS 2.1: https://www.w3.org/TR/CSS2/propidx.html
  'list-style': ['list-style-type', 'list-style-position', 'list-style-image'],
  'margin': ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  'outline': ['outline-width', 'outline-style', 'outline-color'],
  'padding': ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],

  // CSS Backgrounds and Borders Module Level 3: https://www.w3.org/TR/css3-background/
  'background': ['background-image', 'background-position', 'background-size', 'background-repeat', 'background-origin', 'background-clip', 'background-attachment', 'background-color'],
  'background-position': ['background-position-x', 'background-position-y'],  // Not found in the spec, but already implemented by every stable browser
  'border': ['border-width', 'border-style', 'border-color'],
  'border-color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
  'border-style': ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
  'border-width': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
  'border-top': ['border-top-width', 'border-top-style', 'border-top-color'],
  'border-right': ['border-right-width', 'border-right-style', 'border-right-color'],
  'border-bottom': ['border-bottom-width', 'border-bottom-style', 'border-bottom-color'],
  'border-left': ['border-left-width', 'border-left-style', 'border-left-color'],
  'border-radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
  'border-image': ['border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset', 'border-image-repeat'],

  // CSS Fonts Module Level 3: https://www.w3.org/TR/css3-fonts/
  'font': ['font-style', 'font-variant', 'font-weight', 'font-stretch', 'font-size', 'line-height', 'font-family'],
  'font-variant': ['font-variant-ligatures', 'font-variant-alternates', 'font-variant-caps', 'font-variant-numeric', 'font-variant-east-asian'],

  // CSS Flexible Box Layout Module Level 1: https://www.w3.org/TR/css3-flexbox-1/
  'flex': ['flex-grow', 'flex-shrink', 'flex-basis'],
  'flex-flow': ['flex-direction', 'flex-wrap'],

  // CSS Grid Layout Module Level 1: https://www.w3.org/TR/css-grid-1/
  'grid': ['grid-template-rows', 'grid-template-columns', 'grid-template-areas', 'grid-auto-rows', 'grid-auto-columns', 'grid-auto-flow'],
  'grid-template': ['grid-template-rows', 'grid-template-columns', 'grid-template-areas'],
  'grid-row': ['grid-row-start', 'grid-row-end'],
  'grid-column': ['grid-column-start', 'grid-column-end'],
  'grid-area': ['grid-row-start', 'grid-column-start', 'grid-row-end', 'grid-column-end'],
  'grid-gap': ['grid-row-gap', 'grid-column-gap'],

  // CSS Masking Module Level 1: https://www.w3.org/TR/css-masking/
  'mask': ['mask-image', 'mask-mode', 'mask-position', 'mask-size', 'mask-repeat', 'mask-origin', 'mask-clip'],
  'mask-border': ['mask-border-source', 'mask-border-slice', 'mask-border-width', 'mask-border-outset', 'mask-border-repeat', 'mask-border-mode'],

  // CSS Multi-column Layout Module: https://www.w3.org/TR/css3-multicol/
  'columns': ['column-width', 'column-count'],
  'column-rule': ['column-rule-width', 'column-rule-style', 'column-rule-color'],

  // CSS Scroll Snap Module Level 1: https://www.w3.org/TR/css-scroll-snap-1/
  'scroll-padding': ['scroll-padding-top', 'scroll-padding-right', 'scroll-padding-bottom', 'scroll-padding-left'],
  'scroll-padding-block': ['scroll-padding-block-start', 'scroll-padding-block-end'],
  'scroll-padding-inline': ['scroll-padding-inline-start', 'scroll-padding-inline-end'],
  'scroll-snap-margin': ['scroll-snap-margin-top', 'scroll-snap-margin-right', 'scroll-snap-margin-bottom', 'scroll-snap-margin-left'],
  'scroll-snap-margin-block': ['scroll-snap-margin-block-start', 'scroll-snap-margin-block-end'],
  'scroll-snap-margin-inline': ['scroll-snap-margin-inline-start', 'scroll-snap-margin-inline-end'],

  // CSS Speech Module: https://www.w3.org/TR/css3-speech/
  'cue': ['cue-before', 'cue-after'],
  'pause': ['pause-before', 'pause-after'],
  'rest': ['rest-before', 'rest-after'],

  // CSS Text Decoration Module Level 3: https://www.w3.org/TR/css-text-decor-3/
  'text-decoration': ['text-decoration-line', 'text-decoration-style', 'text-decoration-color'],
  'text-emphasis': ['text-emphasis-style', 'text-emphasis-color'],

  // CSS Animations (WD): https://www.w3.org/TR/css3-animations
  'animation': ['animation-name', 'animation-duration', 'animation-timing-function',
    'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-fill-mode', 'animation-play-state'],

  // CSS Transitions (WD): https://www.w3.org/TR/css3-transitions/
  'transition': ['transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay']
};

function isShortHand(property) {
  for (var k in shorthandProperties) {
    if (property.startsWith(k) && shorthandProperties[k].indexOf(property) > -1)
      return k;
  }
}
})();