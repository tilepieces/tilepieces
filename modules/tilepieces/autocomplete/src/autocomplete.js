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
