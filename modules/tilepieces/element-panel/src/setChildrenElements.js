function setChildrenElements() {
  childrenElementUL.innerHTML = [...app.elementSelected.children]
    .map((v, i, a) => {
      var isNodeMatch = !v.tagName.match(/^(HTML|BODY|HEAD|THEAD|TBODY|TFOOT)$/) && app.core.htmlMatch.find(v);
      var grabber = isNodeMatch && a.length > 1 ? `<span class="children-grabber">${childrenGrabberSVG}</span>` : "";
      return `<li data-index=${i}>${grabber}<a href='#'>${app.utils.elementSum(v)}</a></li>`
    })
    .join("");
}