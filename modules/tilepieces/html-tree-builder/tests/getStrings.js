// TODO
function getStrings(token, doc) {
  var rg = new RegExp(token, "gi");
  var nodeList = [];
  var nodeIterator = doc.createNodeIterator(
    doc,
    NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        if (node.nodeType == 1) {
          var nodeTagMatch = node.tagName.match(rg);
          if (nodeTagMatch) {
            nodeList.push({
              node,
              type: "tag",
              name: node.tagName,
              rg: nodeTagMatch
            });
            return NodeFilter.FILTER_ACCEPT;
          }
          for (var i = 0; i < node.attributes.length; i++) {
            var attr = node.attributes[i];
            var nameRg = attr.name.match(rg);
            var valueRg = attr.value.match(rg);
            if (nameRg) {
              nodeList.push({
                node,
                type: "attr-name",
                name: attr.name,
                rg: nameRg
              });
              return NodeFilter.FILTER_ACCEPT;
            }
            if (valueRg) {
              nodeList.push({
                node,
                type: "attr-value",
                name: attr.value,
                rg: valueRg
              });
              return NodeFilter.FILTER_ACCEPT;
            }

          }
        } else {
          var textMatch = node.textContent.match(rg);
          if (textMatch) {
            nodeList.push({
              node,
              type: "attr-value",
              name: node.textContent,
              rg: textMatch
            });
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      }
    },
    false
  );
  return nodeList;
}