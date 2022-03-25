function toggleTH(target, isTh) {
  var docFragment = target.ownerDocument.createDocumentFragment();
  var newNode = target.ownerDocument.createElement(isTh ? "TH" : "TD");
  for (var i = 0, l = target.attributes.length; i < l; ++i) {
    var nodeName = target.attributes.item(i).nodeName;
    var nodeValue = target.attributes.item(i).nodeValue;
    newNode.setAttribute(nodeName, nodeValue);
  }
  [...target.childNodes].forEach(c => newNode.appendChild(c.cloneNode(true)));
  docFragment.appendChild(newNode);
  htmlMatch.replaceWith(target, newNode);
  app.core.selectElement(newNode);
  globalModel.target = newNode;
}

appView.addEventListener("isTh", e => {
  var value = e.detail.target.checked;
  var target = globalModel.target;
  toggleTH(target, value)
});