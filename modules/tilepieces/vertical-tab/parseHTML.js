/*
HTMLText,tilepieces
 */
function parseHTML() {
  var parser = new DOMParser();
  var doc = parser.parseFromString(HTMLText, "text/html");
  doc.querySelectorAll("link").forEach(l=>l.remove());
  doc.querySelectorAll("script").forEach(s=>{
    if(tilepieces.utils.javascriptMimeTypes.indexOf(s.type)>-1)
      s.remove();
  });
  var tabVertical = tilepieces.core.htmlMatch.source.querySelector(".tab-vertical");
  if(tabVertical){
    var tabButtonsInside = doc.querySelector(".tab-buttons-inside");
    var tabVerticalInside = tabVertical.querySelector(".tab-buttons-inside");
    if(tabVerticalInside)
      tabButtonsInside.innerHTML = tabVerticalInside.innerHTML;
  }
  return doc.body.innerHTML;
}