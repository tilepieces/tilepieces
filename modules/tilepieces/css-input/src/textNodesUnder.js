// https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
function textNodesUnder(el) {
  var n, a = [], walk = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  while (n = walk.nextNode()) a.push(n);
  return a;
}