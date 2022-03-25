function parseHTML(HTMLText, tilepieces) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(HTMLText, "text/html");
  doc.querySelectorAll("link").forEach(l => l.remove());
  doc.querySelectorAll("script").forEach(s => {
    if (tilepieces.utils.javascriptMimeTypes.indexOf(s.type) > -1)
      s.remove();
  });
  var dockFrames = doc.getElementById("dock-frames");
  var panelElements = tilepieces.core.htmlMatch.source.querySelectorAll("#dock-frames .panel-element");
  panelElements.forEach(node => {
    dockFrames.append(node.cloneNode(true));
  });
  return doc.body.innerHTML;
}