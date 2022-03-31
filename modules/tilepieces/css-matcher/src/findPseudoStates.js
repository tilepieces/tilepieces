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