function mutation(e) {
  if (isAutoInsertionFlag) {
    isAutoInsertionFlag = false;
    return;
  }
  var ml = e.detail.mutationList;
  var attr = [];
  var childs = [];
  var scriptMutation, cssMutation;
  ml.forEach(m => {
    if (m.type == "attributes") {
      if (attr.indexOf(m.target) < 0)
        attr.push(m.target)
    }
    if (m.type == "childList") {
      if (childs.indexOf(m.target) < 0)
        childs.push(m.target);
      scriptMutation = scriptMutation || [...m.addedNodes].concat([...m.removedNodes]).find(v => v.tagName == "SCRIPT");
      cssMutation = cssMutation || [...m.addedNodes].concat([...m.removedNodes]).find(v =>
        (v.tagName == "LINK" && v.rel.toLowerCase() == "stylesheet") ||
        v.tagName == "STYLE");
    }
    if (m.type == "characterData") {
      if (childs.indexOf(m.target.parentNode) < 0)
        childs.push(m.target.parentNode)
    }
    var targetTagName = m.target.tagName;
    if (
      (targetTagName == "LINK" && m.target.rel.toLowerCase() == "stylesheet") ||
      targetTagName == "STYLE"
    )
      cssMutation = true;
    if (targetTagName == "SCRIPT")
      scriptMutation = true;
  });
  attr.forEach(a => {
    var el = treeBuilder.isInView(a);
    if (el) {
      var attributes = el.querySelector(".html-tree-builder-attributes");
      attributes.outerHTML = treeBuilder.createAttributes(a.attributes);
    }
  });
  childs.forEach(c => {
    var el = treeBuilder.isInView(c);
    if (!el)
      return;
    var target = el.querySelector(".html-tree-builder__caret");
    if (!target) {
      el.querySelector(".html-tree-builder-element")
        .insertAdjacentHTML('beforeend', '<span class="html-tree-builder__caret"></span>');
      return;
    }
    var ul = el.querySelector("ul");
    ul && ul.remove();
    el.classList.remove("open");
    target && treeBuilder.openTree({target});
  });
  /*
  if(isPasteEvent){
      var className = cut ? "cutted":"copied";
      var clipboard = cut || copy;
      clipboard = clipboard.map(n=>{
          var newTarget = treeBuilder.highlightElement(n.el,false);
          newTarget.classList.add(className);
          return{listEl:newTarget,el:n.el}
      });
      if(cut)
          cut = clipboard;
      else copy = clipboard;
      isPasteEvent = false;
  }*/
  if (cssMutation && cssViewDOM.style.display == "block") {
    if (autoInsertionJsCss)
      autoInsertionJsCss = false;
    else
      cssJsView("link[rel=stylesheet],style", cssViewDOM, cssViewDOMList);
  }
  if (scriptMutation && jsViewDOM.style.display == "block")
    if (autoInsertionJsCss)
      autoInsertionJsCss = false;
    else
      cssJsView("script", jsViewDOM, jsViewDOMList);
  var mutateSelections =
    treeBuilder.multiselection ? treeBuilder.multiselected :
      selected ? [{el: selected["__html-tree-builder-el"], listEl: selected}] : [];
  mutateSelections.forEach((v, i) => {
    if (!app.core.currentDocument.documentElement.contains(v.el)) {
      if (!treeBuilder.multiselection) {
        selected = null;
        treeBuilder.deSelect();
      } else {
        treeBuilder.removeItemSelected(i);
        opener.dispatchEvent(
          new CustomEvent("html-tree-remove-multiselection", {detail: {el}})
        );
      }
      return;
    }
    var isInView = treeBuilder.isInView(v.el)
    if (!isInView)
      isInView = treeBuilder.highlightElement(v.el);
    if (isInView != v.listEl) {
      if (selected == v.listEl) {
        selected = isInView;
        treeBuilder.selected = isInView;
      }
      v.listEl = isInView;
      v.listEl.classList.add("html-tree-builder__highlight");
    }
  })
  if(app.elementSelected && selected && selected["__html-tree-builder-el"] != app.elementSelected){
      treeBuilder.highlightElement(app.elementSelected);
  }
  /*
  /*
  if(app.elementSelected && app.core.currentDocument.contains(app.elementSelected)){
      treeBuilder.highlightElement(app.elementSelected);
  }
  else if(app.elementSelected && !app.core.currentDocument.contains(app.elementSelected)){
      app.core.deselectElement();
  }*/
}