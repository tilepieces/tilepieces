const opener = window.opener || window.parent;
let cssUnits = ["em", "ex", "ch", "rem", "vh", "vw", "vmin", "vmax", "%", "cm", "mm", "in", "px", "pt", "pc", "fr"];
//cssUnitsRegex = /(?:[+-]?\d+(?:\.\d+)?)?(em|ex|ch|rem|vh|vw|vmin|vmax|cm|mm|in|px|pt|pc|fr)\b|(?:[+-]?\d+(?:\.\d+)?)%/;
let cssUnitsRegex = /^(em|ex|ch|rem|vh|vw|vmin|vmax|cm|mm|in|px|pt|pc|fr)\b|^%/;
let urlRegex = /url\([^)]*\)/;
let colorRegexFunctions = "rgb\\([^)]*\\)|rgba\\([^)]*\\)|#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\\b|hsl\\([^)]*\\)|hsla\\([^)]*\\)";
let cssColorRegex = "(^|\\s)(" + cssColors.map(v => v.name).join("|") + ")($|\\s)";
let colorRegex = new RegExp(colorRegexFunctions + "|" + cssColorRegex, "i");
/*
 /([+-]?\d+(?:\.\d+)?|[+-]?\.\d+?)((em|ex|ch|rem|vh|vw|vmin|vmax|cm|mm|in|px|pt|pc|fr)\b|%(\s|,|$))/
 */
let numberRegex = /[+-]?\d+(?:\.\d+)?|[+-]?\.\d+?/;
let timeUnits = ["s", "ms"];
let timeRegex = /\d+(s|ms)/;
let mapArrValues = ["number", "unit", "url", "color"];

function inputCss(root) {
  var inps = [...root.querySelectorAll(".input-css")];
  inps.forEach(t => {
    if (!t.hasAttribute("contenteditable"))
      return;
    if (t.ownerDocument.activeElement == t)
      return;
    if (t.nextElementSibling && t.nextElementSibling.classList.contains("input-css-placeholder") &&
      (t.innerText == t.nextElementSibling.innerText))
      return;
    setTargetHTML(t)
  });
  if (root.dataset.inputCssStarted)
    return;
  root.dataset.inputCssStarted = true;
  //root.addEventListener("paste",onPaste);
  root.addEventListener("click", clickButtonsListener);
  root.addEventListener("click", focusInput);
  root.addEventListener("blur", blur, true);
}

function setTargetHTML(target) {
  var text = target.innerText;
  var placeholderEl;
  if (!target.nextElementSibling || !target.nextElementSibling.classList.contains("input-css-placeholder")) {
    placeholderEl = target.ownerDocument.createElement("div");
    placeholderEl.className = "input-css-placeholder";
    target.parentNode.insertBefore(placeholderEl, target.nextElementSibling)
  } else
    placeholderEl = target.nextElementSibling;
  var matchInputCssValues = matchValue(text);
  var padding = 0;
  matchInputCssValues.forEach((v, i) => {
    var start = v.start + padding;
    var end = v.end + padding;
    var value = text.substring(start, end);
    var dti = `data-token-index="${i}"`;
    if (v.type == "number") {
      var numberWrap = `<div class='number-wrap token' ${dti}><span class="arrow-up prevent-click"></span><span class="number-value">${value}</span><span class="arrow-down prevent-click"></span></div>`;
      text = text.substring(0, start) + numberWrap + text.substring(end);
      padding += numberWrap.length - value.length;
    }
    if (v.type == "color") {
      var spanColorButton =
        `<div class="token" ${dti}>
                <span class='span-color-button prevent-click' style="background:${value}"></span>
                <span class="color-value">${value}</span>
                </span>
                </div>`;
      text = text.substring(0, start) + spanColorButton + text.substring(end);
      padding += spanColorButton.length - value.length;
    }
    if (v.type == "url") {
      var spanUrlsButtons =
        `<div class="token" ${dti}>
                <span class='input-css-search-image-in-project prevent-click'></span>
                <span class="url-value">${value}</span>
                </span>
                </div>`;
      text = text.substring(0, start) + spanUrlsButtons + text.substring(end);
      padding += spanUrlsButtons.length - value.length;
    }
  });
  target.classList.add("focus-control");
  placeholderEl.innerHTML = text;
}

window.inputCss = inputCss;
