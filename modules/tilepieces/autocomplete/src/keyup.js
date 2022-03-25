function keyup(e) {
  var el = e.target;
  var val = el.tagName == "INPUT" ? el.value : el.innerText;
  val = val.trim().toLocaleLowerCase();
  var suggestions = el.__autocomplete_suggestions || getGlobalSuggestion(el.dataset.autoGlobalSuggestion);
  var matches = match(val, suggestions);
  if (!matches) {
    hint.style.display = "none";
    hint.innerHTML = "";
    el.__autocomplete_is_running = false;
    return;
  }
  var frag = document.createDocumentFragment();
  var dl = document.createElement("dl");
  dl[dlProperty] = e.target;
  frag.appendChild(dl);
  var pos = el.getBoundingClientRect();
  var scrollY = el.ownerDocument.defaultView.scrollY;
  var left = pos.x + el.ownerDocument.defaultView.scrollX;
  var top = pos.y + scrollY;
  var bottom = top + pos.height;
  matches.forEach(v => dl.insertAdjacentHTML('beforeend', `<dt>${v}</dt>`));
  hint.innerHTML = "";
  hint.appendChild(frag);
  hint.style.height = "";
  hint.style.width = pos.width + "px";
  if (hint.style.display != "block")
    hint.style.display = "block";
  //var hintPos = hint.getBoundingClientRect();
  var hintHeight = hint.offsetHeight;
  var hintWidth = hint.offsetWidth;
  var spaceToBottom = scrollY + window.innerHeight - bottom;
  var spaceToRight = window.innerWidth - left;
  var y = bottom;
  if (spaceToBottom < hintHeight) {
    if (pos.y >= hintHeight)
      y = top - hintHeight;
    else {
      var onTop = top > spaceToBottom;
      var height = onTop ? pos.y : spaceToBottom;
      hint.style.height = height + "px";
      y = onTop ? top - height : y;
    }
  }
  if (spaceToRight < hintWidth) {
    if (pos.x >= hintWidth)
      left = (left + pos.width) - hintWidth;
    else {
      var onLeft = left > spaceToRight;
      var width = onLeft ? pos.x : spaceToRight;
      hint.style.width = width + "px";
      left = onLeft ? left - width : left;
    }
  }
  hint.style.transform = `translate(${left}px,${y}px)`;
  el.__autocomplete_is_running = true;
  if (el.classList.contains("placeholder"))
    el.classList.remove("placeholder")
}