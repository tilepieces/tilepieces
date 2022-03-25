var doc = document.implementation.createHTMLDocument("");
let cache = [];
async function createStyle(style){
  var ajaxReq;
  var alreadyParsed = cache.find(v=>v.href && v.href==style.href);
  if(alreadyParsed && alreadyParsed.sheet)
    return alreadyParsed;
  else if(alreadyParsed && !alreadyParsed.sheet)
    return;
  try {
    ajaxReq = await fetch(style.href);
    if(ajaxReq.status != 200)
      throw "404"
  }
  catch(e){
    cache.push({
        href : style.href,
        sheet : null,
        type : "external"
    });
    return;
  }
  var cssText = await ajaxReq.text();
  var innerStyle = doc.createElement("style");
  innerStyle.appendChild(doc.createTextNode(cssText));
  doc.head.appendChild(innerStyle);
  var sheet = {
      href : style.href,
      sheet : innerStyle.sheet,
      type : "external"
  };
  cache.push(sheet);
  return sheet;
}