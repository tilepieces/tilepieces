function HtmlTreeBuilder(target, el, options = {}) {
  var isDoc = el.nodeType == 9;
  var $self = this;
  el = isDoc ? el.documentElement : el;
  target.innerHTML = "";
  htmlTreeBuilderTarget = target;
  var html = htmlTreeBuilderTarget.ownerDocument.createDocumentFragment();
  var ul = htmlTreeBuilderTarget.ownerDocument.createElement("ul");
  ul.className = "html-tree-builder";
  html.appendChild(ul);
  this.showEmptyNodes = options.showEmptyNodes;
  showEmptyNodes = options.showEmptyNodes;
  treeBuilder(el, ul);

  function hc(e) {
    handleClick(e, $self)
  }

  function mouseover(e) {
    var target = e.target.closest(".html-tree-builder-el");
    if (!target || !target["__html-tree-builder-el"]) return;
    htmlTreeBuilderTarget.dispatchEvent(
      new CustomEvent('html-tree-builder-mouseover', {
        detail: target["__html-tree-builder-el"]
      })
    );
  }

  function mouseout(e) {
    htmlTreeBuilderTarget.dispatchEvent(new Event('html-tree-builder-mouseout'));
  }

  target.appendChild(html);
  target.addEventListener("click", openTree);
  target.addEventListener("click", hc);
  target.addEventListener("mouseover", mouseover);
  target.addEventListener("mouseout", mouseout);
  if (isDoc) {
    var htmlTag = ul.children[0];
    htmlTag.querySelector(".html-tree-builder__caret").click();
    var ulChildrens = htmlTag.querySelector("ul").children;
    for (var HTMLchildrenI = 0; HTMLchildrenI < ulChildrens.length; HTMLchildrenI++) {
      var HTMLchildren = ulChildrens[HTMLchildrenI].children[0];
      if (HTMLchildren.dataset.tagName == "</body>") {
        var caret = HTMLchildren.querySelector(".html-tree-builder__caret");
        caret && caret.click();
        break;
      }
    }
  }
  this.preventDefaultClickOnMs = options.preventDefaultClickOnMs;
  this.target = target;
  this.selected = null;
  this.multiselected = [];
  this.multiselection = false;
  this.removeItemSelected = i => {
    if (typeof i === "undefined")
      i = this.multiselected.length - 1;
    var listEl = this.multiselected[i].listEl;
    listEl.classList.remove("html-tree-builder__highlight");
    this.multiselected.splice(i, 1);
    if (listEl == this.selected) {
      var newIndex = this.multiselected.length - 1;
      this.selected = newIndex > -1 ? this.multiselected[newIndex].listEl : null;
    }
  };
  this.removeMultiSelection = () => {
    this.multiselection = false;
    this.multiselected.forEach(v => v.listEl != this.selected && v.listEl.classList.remove("html-tree-builder__highlight"))
    this.multiselected = [];
  };
  this.activateMultiSelection = () => {
    this.multiselection = true;
    this.selected &&
    this.multiselected.push({listEl: this.selected, el: this.selected["__html-tree-builder-el"]});
  };
  this.clearMultiSelection = () => {
    this.multiselected.forEach(v => v.listEl != this.selected && v.listEl.classList.remove("html-tree-builder__highlight"))
    this.multiselected = [];
  };
  this.deSelect = () => {
    this.selected && this.selected.classList.remove("html-tree-builder__highlight");
    this.selected = null;
  };
  this.el = el;
  this.openTree = openTree;
  this.select = select;
  this.treeBuilder = treeBuilder;
  this.createAttributes = createAttributes;
  this.isInView = isInView;
  this.destroy = () => {
    target.removeEventListener("click", openTree);
    target.removeEventListener("click", hc);
    target.removeEventListener("mouseover", mouseover);
    target.removeEventListener("mouseout", mouseout);
    htmlTreeBuilderTarget = null;
  };
}

window.htmlTreeBuilder = (target, el, options) => {
  return new HtmlTreeBuilder(target, el, options);
}