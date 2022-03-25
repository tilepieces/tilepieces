// pivotEl for css/js view TODO remove
function pasteEl(pivotEl, insertionMode) {
  var els = treeBuilder.multiselection ? treeBuilder.multiselected : [{el: selected["__html-tree-builder-el"]}];
  var copyElements = cut || copy;
  //isPasteEvent = !(!!pivotEl);
  copyElements.sort((a, b) => a.listEl.offsetTop - b.listEl.offsetTop).forEach(n => {
    var toAppend = n.el;
    /*
    if(cut && toAppend.contains(el)){
        console.warn("pasteEl - trying to put an element inside itself");
        return;
    }*/
    els.forEach(multiObj => {
      /*
       if(el.tagName.match(app.utils.notEditableTags)){
       console.warn("pasteEl - trying to put elements inside a void element");
       return;
       }*/
      /*
       if(copy)
       toAppend = toAppend.cloneNode(true);
       app.core.htmlMatch[insertionMode || app.insertionMode](multiObj.el, toAppend, !(!!copy));*/
      var newEl = toAppend.cloneNode(true);
      app.core.htmlMatch[insertionMode || app.insertionMode](multiObj.el, newEl);
      if (cut)
        app.core.htmlMatch.removeChild(toAppend);
    })
  });
  /*
  copyElements.forEach(n => n.listEl.classList.remove("cutted,copied"));
  cut = null;
  copy = null;*/
}