(()=>{
var hint = document.querySelector(".autocomplete-hint");
hint.addEventListener("mousedown", click);
var dlProperty = "__autocomplete__target_element";
var defaults = {
  suggestions: [],
  matchToLowerCase: false,
  max: 15
};
var globalTarget;
var globalFlagOnArrowMove;
window.autocomplete = function (target) {
  target.addEventListener("focus", e => {
    if (e.target.classList.contains("autocomplete")) {
      globalTarget = e.target;
      keyup(e)
    }
  }, true);
  target.addEventListener("keydown", e => {
    if (e.target.classList.contains("autocomplete")) {
      globalTarget = e.target;
      shortcuts(e)
    }
  }, true);
  target.addEventListener("input", e => {
    if (globalFlagOnArrowMove) {
      globalFlagOnArrowMove = false;
      return;
    }
    if (e.target.classList.contains("autocomplete")) {
      globalTarget = e.target;
      keyup(e)
    }
  }, true);
  target.addEventListener("blur", e => {
    if (e.target.classList.contains("autocomplete")) {
      globalTarget = e.target;
      blur(e)
    }
  }, true);
  return {
    blur
  }
};

function blur(e) {
  hint.style.display = "none";
  hint.innerHTML = "";
}
function click(e) {
  if (e.target.nodeName != "DT" && e.target.parentElement.nodeName != "DT")
    return;
  update(e.target, true);
}
function getGlobalSuggestion(string) {
  var keys = string.split(".");
  var global = window;
  keys.forEach(v => global = global[v]);
  return global;
}
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
function match(input, arr) {
  var max = 9;
  var suggestions = input ? arr.filter(v => v.toLocaleLowerCase().startsWith(input) && v != input) : arr;
  if (!suggestions.length)
    return false;
  if (suggestions.length > max)
    suggestions = suggestions.slice(0, max - 1);
  return suggestions.map(v => {
    var toLowercase = v.toLocaleLowerCase();
    var m = "<b>" + toLowercase.substr(toLowercase.indexOf(input), input.length) + "</b>";
    return toLowercase.replace(input, m)
  })
}
function shortcuts(e) {
  var target = e.target;
  var dl = hint.querySelector("dl");
  var el = e.target;
  var selected;
  if (dl)
    selected = dl.querySelector(".selected");
  switch (e.key) {
    case "ArrowUp":
    case "ArrowDown":
      if (!dl)
        return;
      e.preventDefault();
      e.stopPropagation();
      var toUpdate;
      if (selected) {
        selected.classList.remove("selected");
        if (e.key == "ArrowUp") {
          if (selected.previousElementSibling)
            toUpdate = selected.previousElementSibling;
          else
            toUpdate = dl.children[dl.children.length - 1];
        } else {
          if (selected.nextElementSibling)
            toUpdate = selected.nextElementSibling;
          else
            toUpdate = dl.children[0];
        }
      } else {
        var first = dl.children[0];
        if (first && !first.classList.contains("no-suggestions"))
          toUpdate = first;
      }
      if (toUpdate) {
        toUpdate.classList.add("selected");
        globalFlagOnArrowMove = true;
        update(toUpdate);
      }
      break;
    case "ArrowRight":
    case "Enter":
    case "Tab":
      e.key == "Enter" && e.preventDefault();
      if (selected) {
        update(selected, e.key == "Enter" || e.key == "ArrowRight");
      }
      hint.style.display = "none";
      hint.innerHTML = "";
    default:
      break;
  }
}
function translateToPos(x, y) {
  var box = hint.getBoundingClientRect();
  if (y + box.height > window.innerHeight) {
    y = y - box.height;
    if (y < 0) y = 0;
    hint.style.transform = `translate(${x}px,${y}px)`;
  }
  //hint.style.transform = "translate3d(" + Math.round(left) + "px," + Math.round(bottom) + "px,0)";
}
function update(selection, tofocus) {
  var isInputType = globalTarget.tagName == "INPUT";
  if (isInputType)
    globalTarget.value = selection.textContent;
  else
    globalTarget.textContent = selection.textContent;
  if (tofocus) {
    globalTarget.focus();
    if (!isInputType) {
      var sel = globalTarget.ownerDocument.defaultView.getSelection();
      var range = new Range();
      range.selectNode(globalTarget.childNodes[0]);
      range.collapse();
      sel.removeAllRanges();
      sel.addRange(range);
    } else globalTarget.select();
  }
  globalTarget.dispatchEvent(new KeyboardEvent("input", {bubbles: true}));
}

})();