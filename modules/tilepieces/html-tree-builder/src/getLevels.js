function getLevels(el, bodyRoot) {
  /*
  var levels = [el];
  while(el && el != bodyRoot){
      if((el.tagName == "HTML" && el.ownerDocument.defaultView.frameElement)||
          (el == el.ownerDocument.body && el != bodyRoot))
          el = el.ownerDocument.defaultView.frameElement;
      else
          el = el.parentNode;
      levels.unshift(el);
  }
  return levels;*/
  var levels = [];
  var swap = el;
  while (swap) {
    levels.unshift(swap);
    swap = swap.parentNode;
  }
  return levels
}