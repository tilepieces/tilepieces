(()=>{
let cssColors = [
  {
    "name": "AliceBlue",
    "hex": "#F0F8FF"
  },
  {
    "name": "AntiqueWhite",
    "hex": "#FAEBD7"
  },
  {
    "name": "Aqua",
    "hex": "#00FFFF"
  },
  {
    "name": "Aquamarine",
    "hex": "#7FFFD4"
  },
  {
    "name": "Azure",
    "hex": "#F0FFFF"
  },
  {
    "name": "Beige",
    "hex": "#F5F5DC"
  },
  {
    "name": "Bisque",
    "hex": "#FFE4C4"
  },
  {
    "name": "Black",
    "hex": "#000000"
  },
  {
    "name": "BlanchedAlmond",
    "hex": "#FFEBCD"
  },
  {
    "name": "Blue",
    "hex": "#0000FF"
  },
  {
    "name": "BlueViolet",
    "hex": "#8A2BE2"
  },
  {
    "name": "Brown",
    "hex": "#A52A2A"
  },
  {
    "name": "BurlyWood",
    "hex": "#DEB887"
  },
  {
    "name": "CadetBlue",
    "hex": "#5F9EA0"
  },
  {
    "name": "Chartreuse",
    "hex": "#7FFF00"
  },
  {
    "name": "Chocolate",
    "hex": "#D2691E"
  },
  {
    "name": "Coral",
    "hex": "#FF7F50"
  },
  {
    "name": "CornflowerBlue",
    "hex": "#6495ED"
  },
  {
    "name": "Cornsilk",
    "hex": "#FFF8DC"
  },
  {
    "name": "Crimson",
    "hex": "#DC143C"
  },
  {
    "name": "Cyan",
    "hex": "#00FFFF"
  },
  {
    "name": "DarkBlue",
    "hex": "#00008B"
  },
  {
    "name": "DarkCyan",
    "hex": "#008B8B"
  },
  {
    "name": "DarkGoldenRod",
    "hex": "#B8860B"
  },
  {
    "name": "DarkGray",
    "hex": "#A9A9A9"
  },
  {
    "name": "DarkGrey",
    "hex": "#A9A9A9"
  },
  {
    "name": "DarkGreen",
    "hex": "#006400"
  },
  {
    "name": "DarkKhaki",
    "hex": "#BDB76B"
  },
  {
    "name": "DarkMagenta",
    "hex": "#8B008B"
  },
  {
    "name": "DarkOliveGreen",
    "hex": "#556B2F"
  },
  {
    "name": "DarkOrange",
    "hex": "#FF8C00"
  },
  {
    "name": "DarkOrchid",
    "hex": "#9932CC"
  },
  {
    "name": "DarkRed",
    "hex": "#8B0000"
  },
  {
    "name": "DarkSalmon",
    "hex": "#E9967A"
  },
  {
    "name": "DarkSeaGreen",
    "hex": "#8FBC8F"
  },
  {
    "name": "DarkSlateBlue",
    "hex": "#483D8B"
  },
  {
    "name": "DarkSlateGray",
    "hex": "#2F4F4F"
  },
  {
    "name": "DarkSlateGrey",
    "hex": "#2F4F4F"
  },
  {
    "name": "DarkTurquoise",
    "hex": "#00CED1"
  },
  {
    "name": "DarkViolet",
    "hex": "#9400D3"
  },
  {
    "name": "DeepPink",
    "hex": "#FF1493"
  },
  {
    "name": "DeepSkyBlue",
    "hex": "#00BFFF"
  },
  {
    "name": "DimGray",
    "hex": "#696969"
  },
  {
    "name": "DimGrey",
    "hex": "#696969"
  },
  {
    "name": "DodgerBlue",
    "hex": "#1E90FF"
  },
  {
    "name": "FireBrick",
    "hex": "#B22222"
  },
  {
    "name": "FloralWhite",
    "hex": "#FFFAF0"
  },
  {
    "name": "ForestGreen",
    "hex": "#228B22"
  },
  {
    "name": "Fuchsia",
    "hex": "#FF00FF"
  },
  {
    "name": "Gainsboro",
    "hex": "#DCDCDC"
  },
  {
    "name": "GhostWhite",
    "hex": "#F8F8FF"
  },
  {
    "name": "Gold",
    "hex": "#FFD700"
  },
  {
    "name": "GoldenRod",
    "hex": "#DAA520"
  },
  {
    "name": "Gray",
    "hex": "#808080"
  },
  {
    "name": "Grey",
    "hex": "#808080"
  },
  {
    "name": "Green",
    "hex": "#008000"
  },
  {
    "name": "GreenYellow",
    "hex": "#ADFF2F"
  },
  {
    "name": "HoneyDew",
    "hex": "#F0FFF0"
  },
  {
    "name": "HotPink",
    "hex": "#FF69B4"
  },
  {
    "name": "IndianRed ",
    "hex": "#CD5C5C"
  },
  {
    "name": "Indigo  ",
    "hex": "#4B0082"
  },
  {
    "name": "Ivory",
    "hex": "#FFFFF0"
  },
  {
    "name": "Khaki",
    "hex": "#F0E68C"
  },
  {
    "name": "Lavender",
    "hex": "#E6E6FA"
  },
  {
    "name": "LavenderBlush",
    "hex": "#FFF0F5"
  },
  {
    "name": "LawnGreen",
    "hex": "#7CFC00"
  },
  {
    "name": "LemonChiffon",
    "hex": "#FFFACD"
  },
  {
    "name": "LightBlue",
    "hex": "#ADD8E6"
  },
  {
    "name": "LightCoral",
    "hex": "#F08080"
  },
  {
    "name": "LightCyan",
    "hex": "#E0FFFF"
  },
  {
    "name": "LightGoldenRodYellow",
    "hex": "#FAFAD2"
  },
  {
    "name": "LightGray",
    "hex": "#D3D3D3"
  },
  {
    "name": "LightGrey",
    "hex": "#D3D3D3"
  },
  {
    "name": "LightGreen",
    "hex": "#90EE90"
  },
  {
    "name": "LightPink",
    "hex": "#FFB6C1"
  },
  {
    "name": "LightSalmon",
    "hex": "#FFA07A"
  },
  {
    "name": "LightSeaGreen",
    "hex": "#20B2AA"
  },
  {
    "name": "LightSkyBlue",
    "hex": "#87CEFA"
  },
  {
    "name": "LightSlateGray",
    "hex": "#778899"
  },
  {
    "name": "LightSlateGrey",
    "hex": "#778899"
  },
  {
    "name": "LightSteelBlue",
    "hex": "#B0C4DE"
  },
  {
    "name": "LightYellow",
    "hex": "#FFFFE0"
  },
  {
    "name": "Lime",
    "hex": "#00FF00"
  },
  {
    "name": "LimeGreen",
    "hex": "#32CD32"
  },
  {
    "name": "Linen",
    "hex": "#FAF0E6"
  },
  {
    "name": "Magenta",
    "hex": "#FF00FF"
  },
  {
    "name": "Maroon",
    "hex": "#800000"
  },
  {
    "name": "MediumAquaMarine",
    "hex": "#66CDAA"
  },
  {
    "name": "MediumBlue",
    "hex": "#0000CD"
  },
  {
    "name": "MediumOrchid",
    "hex": "#BA55D3"
  },
  {
    "name": "MediumPurple",
    "hex": "#9370DB"
  },
  {
    "name": "MediumSeaGreen",
    "hex": "#3CB371"
  },
  {
    "name": "MediumSlateBlue",
    "hex": "#7B68EE"
  },
  {
    "name": "MediumSpringGreen",
    "hex": "#00FA9A"
  },
  {
    "name": "MediumTurquoise",
    "hex": "#48D1CC"
  },
  {
    "name": "MediumVioletRed",
    "hex": "#C71585"
  },
  {
    "name": "MidnightBlue",
    "hex": "#191970"
  },
  {
    "name": "MintCream",
    "hex": "#F5FFFA"
  },
  {
    "name": "MistyRose",
    "hex": "#FFE4E1"
  },
  {
    "name": "Moccasin",
    "hex": "#FFE4B5"
  },
  {
    "name": "NavajoWhite",
    "hex": "#FFDEAD"
  },
  {
    "name": "Navy",
    "hex": "#000080"
  },
  {
    "name": "OldLace",
    "hex": "#FDF5E6"
  },
  {
    "name": "Olive",
    "hex": "#808000"
  },
  {
    "name": "OliveDrab",
    "hex": "#6B8E23"
  },
  {
    "name": "Orange",
    "hex": "#FFA500"
  },
  {
    "name": "OrangeRed",
    "hex": "#FF4500"
  },
  {
    "name": "Orchid",
    "hex": "#DA70D6"
  },
  {
    "name": "PaleGoldenRod",
    "hex": "#EEE8AA"
  },
  {
    "name": "PaleGreen",
    "hex": "#98FB98"
  },
  {
    "name": "PaleTurquoise",
    "hex": "#AFEEEE"
  },
  {
    "name": "PaleVioletRed",
    "hex": "#DB7093"
  },
  {
    "name": "PapayaWhip",
    "hex": "#FFEFD5"
  },
  {
    "name": "PeachPuff",
    "hex": "#FFDAB9"
  },
  {
    "name": "Peru",
    "hex": "#CD853F"
  },
  {
    "name": "Pink",
    "hex": "#FFC0CB"
  },
  {
    "name": "Plum",
    "hex": "#DDA0DD"
  },
  {
    "name": "PowderBlue",
    "hex": "#B0E0E6"
  },
  {
    "name": "Purple",
    "hex": "#800080"
  },
  {
    "name": "RebeccaPurple",
    "hex": "#663399"
  },
  {
    "name": "Red",
    "hex": "#FF0000"
  },
  {
    "name": "RosyBrown",
    "hex": "#BC8F8F"
  },
  {
    "name": "RoyalBlue",
    "hex": "#4169E1"
  },
  {
    "name": "SaddleBrown",
    "hex": "#8B4513"
  },
  {
    "name": "Salmon",
    "hex": "#FA8072"
  },
  {
    "name": "SandyBrown",
    "hex": "#F4A460"
  },
  {
    "name": "SeaGreen",
    "hex": "#2E8B57"
  },
  {
    "name": "SeaShell",
    "hex": "#FFF5EE"
  },
  {
    "name": "Sienna",
    "hex": "#A0522D"
  },
  {
    "name": "Silver",
    "hex": "#C0C0C0"
  },
  {
    "name": "SkyBlue",
    "hex": "#87CEEB"
  },
  {
    "name": "SlateBlue",
    "hex": "#6A5ACD"
  },
  {
    "name": "SlateGray",
    "hex": "#708090"
  },
  {
    "name": "SlateGrey",
    "hex": "#708090"
  },
  {
    "name": "Snow",
    "hex": "#FFFAFA"
  },
  {
    "name": "SpringGreen",
    "hex": "#00FF7F"
  },
  {
    "name": "SteelBlue",
    "hex": "#4682B4"
  },
  {
    "name": "Tan",
    "hex": "#D2B48C"
  },
  {
    "name": "Teal",
    "hex": "#008080"
  },
  {
    "name": "Thistle",
    "hex": "#D8BFD8"
  },
  {
    "name": "Tomato",
    "hex": "#FF6347"
  },
  {
    "name": "Turquoise",
    "hex": "#40E0D0"
  },
  {
    "name": "Violet",
    "hex": "#EE82EE"
  },
  {
    "name": "Wheat",
    "hex": "#F5DEB3"
  },
  {
    "name": "White",
    "hex": "#FFFFFF"
  },
  {
    "name": "WhiteSmoke",
    "hex": "#F5F5F5"
  },
  {
    "name": "Yellow",
    "hex": "#FFFF00"
  },
  {
    "name": "YellowGreen",
    "hex": "#9ACD32"
  }
]
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

function findValues(value) {
  var mNumber = value.match(numberRegex);
  if (mNumber) { //lookbehind
    var prev = value.charAt(mNumber.index - 1);
    if (prev && !prev.match(/\s|,|\(/))
      mNumber = null;
  }
  var mUnit = value.match(cssUnitsRegex);
  var mUrl = value.match(urlRegex);
  var mColor = value.match(colorRegex);
  var arrValues = [mNumber, mUnit, mUrl, mColor];
  return {
    arrValues,
    found: arrValues.filter(f => f)
  };
}

function matchValue(value) {
  var tokens = [];
  var incr = 0;
  var values = findValues(value);
  while (values.found.length) {
    var first = values.found.sort((a, b) => a.index - b.index)[0];
    var indexForMap = values.arrValues.indexOf(first);
    var end = first.index + first[0].length;
    tokens.push({
      end: incr + end,
      type: mapArrValues[indexForMap],
      start: incr + first.index
    });
    value = value.substring(end);
    values = findValues(value);
    incr += end;
  }
  return tokens
}
function move(target, token, dir, range, incr) {
  var string = target.innerHTML;
  if (token.type == "number") {
    var number = Number(string.substring(token.start, token.end));
    var originalDecimalLength = ("" + number).split(".")[1];
    var newValue = 0;
    if (dir == "up")
      newValue = number + incr;
    if (dir == "down")
      newValue = number - incr;
    if (originalDecimalLength)
      newValue = newValue.toFixed(originalDecimalLength.length);
  }
  /*
  if(type == "unit") {
      var unit = string.substring(token.start, token.end);
      var index = cssUnits.indexOf(unit);
      if(dir == "up")
          newValue = cssUnits[index+1<cssUnits.length ? index+1 : 0];
      else
          newValue = cssUnits[index-1>=0 ? index-1 : cssUnits.length-1];
  }*/
  var firstP = string.substring(0, token.start);
  var endP = string.substring(token.end);
  target.textContent = firstP + newValue + endP;
  range.setStart(target.childNodes[0], token.start);
  range.setEnd(target.childNodes[0], token.start + ("" + newValue).length);
  target.dispatchEvent(new KeyboardEvent("input", {bubbles: true}));
}
function setText(inputCssPlaceholder) {
  var inputCss = inputCssPlaceholder.previousElementSibling;
  inputCss.textContent = textNodesUnder(inputCssPlaceholder).map(t => t.textContent).join("");
  inputCss.dispatchEvent(new KeyboardEvent("input", {bubbles: true}));
  inputCss.dispatchEvent(new Event("css-input-set-text", {bubbles: true}))
}
// https://stackoverflow.com/questions/10730309/find-all-text-nodes-in-html-page
function textNodesUnder(el) {
  var n, a = [], walk = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  while (n = walk.nextNode()) a.push(n);
  return a;
}
function blur(e) {
  var t = e.target;
  if (!t.classList.contains("input-css"))
    return;
  t.__current_token = false;
  if (!t.hasAttribute("contenteditable")) {
    t.classList.add("focus-control");
    return;
  }
  setTargetHTML(e.target);
}
function clickButtonsListener(e) {
  var inputCssPlaceholder = e.target.closest(".input-css-placeholder");
  var t = e.target;
  var isColorButton = t.classList.contains("span-color-button");
  var isNumberArrowUp = t.classList.contains("arrow-up");
  var isNumberArrowDown = t.classList.contains("arrow-down");
  var isSearchImgInProjectButton = t.classList.contains("input-css-search-image-in-project");
  if (isColorButton)
    colorButtonClick(e);
  else if (isNumberArrowUp || isNumberArrowDown) {
    var numberSpan = t.parentNode.querySelector(".number-value");
    var originalDecimalLength = numberSpan.textContent.split(".")[1];
    var numberValue = +numberSpan.textContent;
    var newValue = isNumberArrowUp ? numberValue + 1 : numberValue - 1;
    numberSpan.textContent = originalDecimalLength ? newValue.toFixed(originalDecimalLength.length) : newValue;
    setText(inputCssPlaceholder)
  } else if (isSearchImgInProjectButton)
    clickImageInProject(e);
}
function clickImageInProject(e) {
  var inputCssPlaceholder = e.target.closest(".input-css-placeholder");
  var pathhref = "";
  if (opener.tilepieces?.core?.currentStyleSheet?.ownerNode.tagName === "LINK") {
    var linkHref = opener.tilepieces.core.currentStyleSheet.href.replace(location.origin, "");
    var frameResourcePath = opener.tilepieces.utils.paddingURL(opener.tilepieces.frameResourcePath());
    pathhref = linkHref.replace(frameResourcePath, "");
  }
  var imageSearch = opener.dialogReader("img", pathhref);
  imageSearch.then(imageSearchDialog => {
    imageSearchDialog.on("submit", src => {
      e.target.nextElementSibling.textContent = "url(" + src + ")";
      setText(inputCssPlaceholder)
    });
  }, e => {
    opener.alertDialog.open(e.error || e.err || e.toString(), true);
    console.log(e);
  })
}

function colorButtonClick(e) {
  var inputCssPlaceholder = e.target.closest(".input-css-placeholder");
  var color = e.target.nextElementSibling.textContent;
  var isNameColor = cssColors.find(c => c.name.toLocaleLowerCase() == color.trim().toLowerCase());
  if (isNameColor)
    color = isNameColor.hex;
  //opener.app.colorPicker.show();
  var throttle;
  opener.tilepieces.colorPicker(color).onChange(c => {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      var rgbColor = c.rgba[3] < 1 ? `rgba(${c.rgba[0]}, ${c.rgba[1]}, ${c.rgba[2]}, ${c.rgba[3]})` :
        `rgb(${c.rgba[0]}, ${c.rgba[1]}, ${c.rgba[2]})`;// TODO only rgb?
      e.target.nextElementSibling.textContent = rgbColor;
      e.target.style.background = rgbColor;
      setText(inputCssPlaceholder)
    }, 32)
  })
}
function focusInput(e) {
  var el = e.target;
  var cssInputPlaceholder = el.closest(".input-css-placeholder");
  if (!cssInputPlaceholder)
    return;
  if (el.classList.contains("prevent-click") || el.closest(".prevent-click"))
    return;
  var cssInput = cssInputPlaceholder.previousElementSibling;
  cssInput.classList.remove("focus-control");
  if (!cssInputPlaceholder.innerText.trim()) {
    cssInput.focus();
    return;
  }
  var isToken = el.closest("div.token");
  var dti = isToken && isToken.dataset.tokenIndex;
  var selection = cssInput.ownerDocument.defaultView.getSelection();
  var range = new Range();
  if (dti) {
    var tokens = matchValue(cssInput.innerText);
    var token = tokens[dti];
    range.setStart(cssInput.childNodes[0], token.start);
    range.setEnd(cssInput.childNodes[0], token.end);
  } else
    range.selectNodeContents(cssInput.childNodes[0]);
  selection.removeAllRanges();
  selection.addRange(range);
  cssInput.focus();
}
function onInput(e) {
  var target = e.target;
  if (!target || !target.classList)
    return;
  if (!target.classList.contains("input-css"))
    return;
  if (!target.hasAttribute("contenteditable"))
    return;
  if (target.__autocomplete_is_running)
    return;
  var sel = e.target.ownerDocument.defaultView.getSelection();
  var range = sel.getRangeAt(0);
  var tokens = matchValue(target.innerHTML);
  var token = tokens
    .find(v => range.startOffset >= v.start && range.endOffset <= v.end);
  if (e.key == "Enter")
    e.preventDefault();
  if (!token)
    return;
  if ((e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "PageUp" || e.key == "PageDown") && token.type == "number") {
    e.preventDefault();
    var moveDir = e.key == "ArrowUp" || e.key == "PageUp" ? "up" : "down";
    var incr = 1;
    if (e.ctrlKey)
      incr = 100;
    else if (e.shiftKey)
      incr = 10;
    else if (e.altKey)
      incr = 0.1;
    move(target, token, moveDir, range, incr);
  }
}

document.addEventListener("keydown", onInput, true);
function mousewheel(e) {
  var target = e.target;
  if (!target || !target.classList)
    return;
  if (!target.classList.contains("input-css"))
    return;
  if (!target.hasAttribute("contenteditable"))
    return;
  if (target.__autocomplete_is_running)
    return;
  var sel = target.ownerDocument.defaultView.getSelection();
  var range = sel.getRangeAt(0);
  var tokens = matchValue(target.innerHTML);
  var token = tokens
    .find(v => range.startOffset >= v.start && range.endOffset <= v.end);
  if (e.key == "Enter")
    e.preventDefault();
  if (!token)
    return;
  var delta = Math.sign(e.deltaY);
  var moveDir = delta < 0 ? "up" : "down";
  var incr;
  if (e.ctrlKey)
    incr = 100;
  else if (e.shiftKey)
    incr = 10;
  else if (e.altKey)
    incr = 0.1;
  else incr = 1;
  move(target, token, moveDir, range, incr);
  e.preventDefault();
}

window.addEventListener('mousewheel', mousewheel, {passive: false});
window.addEventListener("window-popup-open", e => {
  var doc = e.detail.newWindow.document;
  doc.addEventListener("keydown", onInput, true);
  e.detail.newWindow.addEventListener('mousewheel', mousewheel, {passive: false});
});
function insertTextAtCursor(text, t) {
  var sel, range;
  sel = t.ownerDocument.defaultView.getSelection();
  range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(t.ownerDocument.createTextNode(text));
  var en = new KeyboardEvent("input", {bubbles: true});
  t.dispatchEvent(en);
}

function onPaste(e) {
  if (!e.target.classList.contains("input-css"))
    return;
  e.preventDefault();
  if (e.clipboardData && e.clipboardData.getData) {
    var text = e.clipboardData.getData("text/plain");
    if (text.length)
      insertTextAtCursor(text, e.target);
  }
}

})();