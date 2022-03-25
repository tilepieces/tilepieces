function createDocType(el) {
  if (el.doctype) {
    var doctype = {
      name: el.doctype.name,
      publicId: el.doctype.publicId,
      systemId: el.doctype.systemId
    };
    var html = '<!DOCTYPE ' + doctype.name;
    if (doctype.publicId.length) html += ' PUBLIC "' + doctype.publicId + '"';
    if (doctype.systemId.length) html += ' "' + doctype.systemId + '"';
    html += ">";
    return html;
  }
  return "<!DOCTYPE html>";
}