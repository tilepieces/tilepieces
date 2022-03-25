const opener = window.opener || window.parent;
let app = opener.tilepieces;
window.app = app;
window.cssDefaults = app.cssDefaultValues;
const appView = document.getElementById("css-text");
let fontAlreadyDeclared = [];
let textShadowEls = [];
const commaToNotTakeInConsideration = /rgb\([^)]*\)|rgba\([^)]*\)|hsl\([^)]*\)|hsla\([^)]*\)/;
const fontFamilyInput = document.getElementById("font-family-input");
var model = {
  isVisible: false,
  textShadows: []
};
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
autocomplete(appView);
let t = new opener.TT(appView, model);
if (app.elementSelected)
  setTemplate({detail: app.cssSelectorObj});

tilepieces_tabs({
  el: document.getElementById("tab-css-text")
});

appView.addEventListener("click", e => {
  if (!e.target.classList.contains("color-button"))
    return;
  var target = e.target;
  var cssProperty = target.dataset.cssProp;
  var throttle;
  app.colorPicker(target.style.backgroundColor).onChange(c => {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      if (target.dataset.textShadow) {
        model.textShadows[target.dataset.index].color = c.hex;
        model.textShadow = setTextShadow(model.textShadows);
      } else {
        model.realColor = c.hex;
        model.color = setCss(cssProperty, c.hex);
      }
      t.set("", model);
      inputCss(appView)
    }, 32)
  })
})
/*
appView.addEventListener("template-digest",e=>{
    var target = e.detail.target;
    if(target.dataset.cssProp && target.value){
        setCss(target.dataset.cssProp,target.value);
        inputCss(appView);
    }
},true);*/
/*
appView.addEventListener("css-input-set-text",e=> {
    if (!e.target.classList.contains("input-css"))
        return;
    t.set("",model);
},true);*/
appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  if (!e.target.dataset.cssProp)
    return;
  if (e.target.dataset.value == e.target.innerText)
    return;
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
appView.addEventListener("input", e => {
  var target = e.target;
  if (!target.classList.contains("input-css"))
    return;
  var prop = target.dataset.cssProp;
  if (prop) {
    var value = target.innerText;
    var newSetted = setCss(prop, value);
  }
}, true);
appView.addEventListener("template-digest", e => {
  var target = e.detail.target;
  if (target.dataset.textShadow) {
    if (target.dataset.bind == "textShadowValue.blurToSlider")
      model.textShadows[target.dataset.index][target.dataset.textShadow] = target.value;
    model.textShadow = setTextShadow(model.textShadows);
    t.set("", model);
    inputCss(appView);
    setTextShadowSVGtoXY();
  }
}, true);
appView.addEventListener("css-input-set-text", e => {
  if (!e.target.classList.contains("input-css") ||
    e.target.dataset.cssPropJs != "textShadow")
    return;
  mapTextShadow(e.target.innerText.trim());
  t.set("", model);
  setTextShadowSVGtoXY();
}, true);
/*
appView.addEventListener("blur",e=>{
    var target = e.target;
    if(target.dataset.textShadow){

    }
},true);*/
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("add-text-shadow"))
    return;
  model.textShadows.push({
    index: model.textShadows.length,
    color: "rgb(0,0,0)",
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    blurToSlider: 0
  });
  model.textShadow = setTextShadow(model.textShadows);
  t.set("", model);
  inputCss(appView);
  setTextShadowSVGtoXY();
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("remove-text-shadow"))
    return;
  var index = +e.target.dataset.index;
  model.textShadows.splice(index, 1);
  model.textShadow = setTextShadow(model.textShadows);
  if (!model.textShadow)
    model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  else {
    t.set("", model);
    inputCss(appView);
  }
});

function getProp(name, _default) {
  return model._properties[name] ? model._properties[name].value : (_default || model._styles[name]);
}

function mapTextShadow(textShadowStat) {
  if (textShadowStat == "none") {
    model.textShadows = []
  } else {
    var textShadows = app.utils.splitCssValue(textShadowStat);//splitTextShadow();
    model.textShadows = textShadows.map((s, index) => {
      var colorMatch = s.match(app.utils.colorRegex);
      var values = s.match(app.utils.valueRegex);
      var numberoffsetX = values[0].match(app.utils.numberRegex);
      var numberoffsetY = values[1].match(app.utils.numberRegex);
      var blur = values[2] ? values[2].match(app.utils.numberRegex) : 0;
      var blurToSlider = !blur ? 0 : blur[0];
      return {
        index,
        color: colorMatch ? colorMatch[0] : "rgb(0,0,0)",
        offsetX: numberoffsetX ? numberoffsetX[0] : 0,
        offsetY: numberoffsetY ? numberoffsetY[0] : 0,
        blur: blurToSlider,
        blurToSlider
      }
    })
  }
}

function setCss(name, value) {
  var target = model.elementPresent;
  var setCss = app.core.setCss(target, name, value);
  console.log("setcss", name, value);
  return setCss;
}

function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  var d = e.detail;
  model.match = d.match;
  model.isVisible = true;
  model._properties = d.cssRules.properties;
  model._styles = d.styles;
  model.elementPresent = d.target;
  model.fatherStyle = d.fatherStyle || {display: "none"}; // HTML TAG HAS NO FATHER
  var fatherStyle = model.fatherStyle;
  model.fontSize = getProp("font-size");
  model.fontFamily = getProp("font-family");
  model.fontWeight = getProp("font-weight");
  model.fontStyle = getProp("font-style");
  model.lineHeight = getProp("line-height");
  model.textAlign = getProp("text-align");
  model.realColor = d.styles["color"];
  model.color = getProp("color");
  model.textDecoration = getProp("text-decoration");
  model.textTransform = getProp("text-transform");
  model.textIndent = getProp("text-indent");
  model.letterSpacing = getProp("letter-spacing");
  model.wordSpacing = getProp("word-spacing");
  model.textShadow = getProp("text-shadow");
  mapTextShadow(d.styles.textShadow);
  t.set("", model);
  inputCss(appView);
  setTextShadowSVGtoXY();
}

function setTextShadow(textShadows) {
  var newTextShadows = textShadows.map(ts => {
    return ts.offsetX + "px " + ts.offsetY + "px " + ts.blur + "px " + ts.color;
  }).join(",");
  return setCss("text-shadow", newTextShadows);
}

function setTextShadowSVGtoXY() {
  var textShadowElsDOM = appView.querySelectorAll(".text-shadow");
  textShadowElsDOM.forEach(tse => {
    var svg = tse.querySelector("svg");
    var textShadow = svg.closest(".text-shadow");
    var isAlreadyShadow = textShadowEls.find(v => v.target == svg);
    var offsetXInput = textShadow.querySelector("[data-text-shadow=offsetX]");
    var offsetYInput = textShadow.querySelector("[data-text-shadow=offsetY]");
    if (!isAlreadyShadow) {
      var newSvgTextShadow = SVGtoXY(svg);
      // 100 = svg width / 2
      // 5 : arbitrary change value on axis
      var throttle;
      newSvgTextShadow.onChange((x, y) => {
        clearTimeout(throttle);
        throttle = setTimeout(() => {
          var xAxis = Math.trunc((x - 100) / 5);
          var yAxis = Math.trunc((y - 100) / 5);
          //offsetXInput.value = xAxis;
          //offsetYInput.value = yAxis;
          model.textShadows[svg.dataset.index].offsetX = xAxis;
          model.textShadows[svg.dataset.index].offsetY = yAxis;
          model.textShadow = setTextShadow(model.textShadows);
          t.set("", model);
          inputCss(appView);
        })
      });
      newSvgTextShadow.setXY((offsetXInput.value * 5) + 100, (offsetYInput.value * 5) + 100);
      textShadowEls.push(newSvgTextShadow);
    } else {
      isAlreadyShadow.setXY((offsetXInput.value * 5) + 100, (offsetYInput.value * 5) + 100);
    }
  })
}

// todo remove
function splitTextShadow(textShadow) {
  var textShadowSwap = textShadow;
  var commas = [];
  var possibleComma = textShadow.indexOf(",");
  var falseIndex = 0;
  var count = 0;
  while (possibleComma > -1) {
    var falseComma = textShadowSwap.match(commaToNotTakeInConsideration);
    if (!falseComma ||
      (possibleComma < falseComma.index ||
        possibleComma > (falseComma.index + falseComma[0].length))) {
      commas.push(falseIndex + possibleComma);
      falseIndex += possibleComma
    } else falseIndex = falseIndex + falseComma[0].length;
    textShadowSwap = textShadowSwap.substring(falseIndex);
    possibleComma = textShadowSwap.indexOf(",");
    count++;
    if (count > 50000)
      throw new Error(["textShadow", textShadow, "textShadowSwap", textShadowSwap, "possibleComma", possibleComma,
        "falseIndex", falseIndex].join(","))
  }
  if (!commas.length)
    return [textShadow];
  else {
    var textShadows = [];
    var start = 0;
    commas.forEach((c, i, a) => {
      textShadows.push(textShadow.substring(start, start + c).trim());
      if (i == a.length - 1) {
        textShadows.push(textShadow.substring(start + c + 1, textShadow.length).trim());
      }
      start = c;
    });
    return textShadows;
  }
}
