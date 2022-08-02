HtmlTreeBuilder.prototype.highlightElement = function (target, highlight = true) {
  //var treeBuilderDOMRepr = htmlTreeBuilderTarget.ownerDocument.querySelector(".html-tree-builder");
  //var treeBuilderDOMRepr = htmlTreeBuilderTarget.children[0];
  //var treeBuilderDOMRepr = htmlTreeBuilderTarget.querySelector(".html-tree-builder-el");
  var rootElement = htmlTreeBuilderTarget.querySelector(".html-tree-builder-el");
  //var levels = getLevels(target,root || rootElement["__html-tree-builder-el"]);
  var levels = getLevels(target);
  levels.forEach((level) => {
    var caret = rootElement.querySelector(".html-tree-builder__caret");
    if(!caret){
      caret = document.createElement("span");
      caret.className = "html-tree-builder__caret";
      rootElement.querySelector(".html-tree-builder-element")
        .insertAdjacentElement('beforeend', caret);
    }
    var li = caret.closest("li");
    if (!li.classList.contains("open"))
      openTree({target: caret});
    var ul = rootElement.querySelector("ul");
    // childrens are represented inside an ul tag ( except for the main html )
    [...ul.children].forEach((children) => {
      if (children["__html-tree-builder-el"] == level)
        rootElement = children;
      /*
      else if(children["__html-tree-builder-el"] &&
          children["__html-tree-builder-el"].nodeName == "IFRAME"){
      }
      */
      /*
      else if(children.classList.contains("html-tree-builder-body")) // we are inside an iframe representation
          if(children.children[0]["__html-tree-builder-el"] == level) // if the body is ancestor, assign it
              rootElement = children.children[0];
              */
    });
  });
  // get rootElement immediately visible by scrolling html-tree-builder container
  if (highlight) {
    this.toggleClassListHighlight(rootElement);
    //rootElement.querySelector(".html-tree-builder-element").scrollIntoView(false);
    var win = rootElement.ownerDocument.defaultView;
    var bound = rootElement.querySelector(".html-tree-builder__tag").getBoundingClientRect();
    win.scroll({
      top: bound.top + (bound.height / 2 ) + win.scrollY - (win.innerHeight / 2),
      left: 0
    });
  }
  return rootElement;
}