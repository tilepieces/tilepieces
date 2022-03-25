function parseHTML(HTMLText,tilepieces) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(HTMLText, "text/html");
  doc.querySelectorAll("link").forEach(l=>l.remove());
  doc.querySelectorAll("script").forEach(s=>{
    if(tilepieces.utils.javascriptMimeTypes.indexOf(s.type)>-1)
      s.remove();
  });
  return '<html><body><template id="tilepieces-search-template">' + doc.body.innerHTML + '</template></body></html>';
}