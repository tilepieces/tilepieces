HtmlTreeBuilder.prototype.toggleClassListHighlight = function (element) {
  var multiselection = this.multiselection;
  // toggle previous highlight class
  !multiselection && this.selected && this.selected.classList.remove("html-tree-builder__highlight");
  if(element){
    element.classList.add("html-tree-builder__highlight");
    var treeBuilderElement = element.querySelector(".html-tree-builder__tag");
    var toggleWrapper = element.querySelector(".menu-toggle-wrapper");
    toggleWrapper.style.height = treeBuilderElement.offsetHeight + "px";
  }
  this.multiselection &&
  !this.multiselected.find(v => v.listEl == element) &&
  this.multiselected.push({listEl: element, el: element["__html-tree-builder-el"]});
  if (element)
    this.selected = element;
}