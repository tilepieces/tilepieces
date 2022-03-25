function createDocumentString(doc) {
  var body = doc.documentElement.outerHTML.replace(/[\u200B-\u200D\uFEFF]/g, "");
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