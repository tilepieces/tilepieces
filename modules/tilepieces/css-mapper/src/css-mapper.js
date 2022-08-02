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
    classes : [],
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