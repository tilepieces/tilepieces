function parseHTML(HTMLText,tilepieces) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(HTMLText, "text/html");
  var dialogTemplateContent = doc.getElementById("dialog-templates").querySelector(".tilepieces-dialog-content");
  var dialogIntroduction = doc.getElementById("dialog-introduction").querySelector(".tilepieces-dialog-content");
  doc.querySelectorAll("link").forEach(l=>l.remove());
  doc.querySelectorAll("script").forEach(s=>{
    if(tilepieces.utils.javascriptMimeTypes.indexOf(s.type)>-1)
      s.remove();
  });
  doc.body.innerHTML = '<template id="dialog-templates">' + dialogTemplateContent.innerHTML + '</template>' +
    '<template id="dialog-introduction">' + dialogIntroduction.innerHTML + '</template>'
  return '<html><body>'+ doc.body.innerHTML + '</body></html>';
}