function createDocInWin(doc, targetDocument) {
  var newChilds = [];
  //var styles = doc.querySelectorAll("head link[rel=stylesheet],head style");
  //var newStyles = [...styles].map(v=>v.cloneNode(true));
  for (var i = 0; i < doc.body.childNodes.length; i++) {
    var child = doc.body.childNodes[i];
    if (child.tagName == "SCRIPT")
      continue;
    newChilds.push(child)
  }
  //newStyles.forEach(newStyle=>targetDocument.head.appendChild(newStyle));
  newChilds.forEach(c => {
    targetDocument.adoptNode(c);
    targetDocument.body.appendChild(c)
  });
}

function resetDocInFrame(doc, targetDocument) {
  var newChilds = [];
  for (var i = 0; i < doc.body.childNodes.length; i++) {
    var child = doc.body.childNodes[i];
    child.id !== "stop-editing" && newChilds.push(child)
  }
  newChilds.forEach(c => {
    targetDocument.adoptNode(c);
    targetDocument.body.appendChild(c)
  });
}