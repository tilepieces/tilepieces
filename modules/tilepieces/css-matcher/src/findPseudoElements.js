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