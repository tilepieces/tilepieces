function nextNode(node) {
  if (node.hasChildNodes())
    return node.firstChild;
  while (node && !node.nextSibling)
    node = node.parentNode;
  if (!node)
    return null;
  return node.nextSibling;
}

function getElementsInRange(startNode, endNode) {
  var nodes = [];
  var next = startNode;
  while (next) {
    nodes.push(next);
    if (next == endNode)
      break;
    next = nextNode(next, endNode);
  }
  return nodes;
}