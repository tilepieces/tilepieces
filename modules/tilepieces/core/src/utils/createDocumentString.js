function createDocumentString(doc,maxTrim) {
  var regexToReplace = maxTrim ? /([\u200B-\u200D\uFEFF]|\n|\t|\r)/g : /[\u200B-\u200D\uFEFF]/g;
  var body = doc.documentElement.outerHTML.replace(regexToReplace, "");
  if (doc.doctype) {
    var doctype = {
      name: doc.doctype.name,
      publicId: doc.doctype.publicId,
      systemId: doc.doctype.systemId
    };
    var dctype = '<!DOCTYPE ' + doctype.name;
    if (doctype.publicId.length) dctype += ' PUBLIC "' + doctype.publicId + '"';
    if (doctype.systemId.length) dctype += ' "' + doctype.systemId + '"';
    dctype += ">\r\n";
    return dctype + body;
  }
  return '<!DOCTYPE html>' + body;
}