(()=>{
const opener = window.opener || window.parent;
const app = opener.tilepieces;
window.cssDefaults = opener.tilepieces.cssDefaultValues;
const appView = document.getElementById("border-style");
const urlPlaceholder = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=)";
const gradientEl = appView.querySelector(".gradient");
let gradientObject = gradientView(gradientEl);
let shadows = [];
let model = {
  isVisible: false,
  boxShadows: []
};
let t = new opener.TT(appView, model);
autocomplete(appView);
if (opener.tilepieces.elementSelected)
  setTemplate({detail: opener.tilepieces.cssSelectorObj});
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
tilepieces_tabs({
  el: document.getElementById("tab-border")
});
function parsingImageUrl(url){
  if(url.startsWith("data:image") || url.match(app.utils.URLIsAbsolute))
    return url;
  if(url.startsWith("/"))
    return app.utils.getResourceAbsolutePath(url);
  return new URL(url,model.backgroundImageBase).href
}
appView.addEventListener("borderImageInput", e => {
  var target = e.detail.target;
  opener.tilepieces.utils.processFile(target.files[0]).then(res => {
    if (res)
      setCss("border-image-source", res);
  })
});
appView.addEventListener("template-digest", e => {
  var target = e.detail.target;
  if (target.dataset.shadow) {
    if (target.dataset.bind == "boxShadowValue.blurToSlider")
      model.boxShadows[target.dataset.index][target.dataset.shadow] = target.value;
    model.boxShadow = setShadow();
    t.set("", model);
    inputCss(appView);
    if (target.dataset.shadow.startsWith("offset")) {
      var offsetX = model.boxShadows[target.dataset.index].offsetX;
      var offsetY = model.boxShadows[target.dataset.index].offsetY;
      var svg = appView.querySelector(".shadow[data-index='" + target.dataset.index + "'] svg");
      var isAlreadyShadow = shadows.find(v => v.target == svg);
      isAlreadyShadow.setXY((offsetX * 5) + 100, (offsetY * 5) + 100);
    }
  }
}, true);

appView.addEventListener("css-input-set-text", e => {
  if (!e.target.classList.contains("input-css") ||
    e.target.dataset.cssPropJs != "boxShadow")
    return;
  mapBoxShadow(e.target.innerText.trim());
  t.set("", model);
  setBoxShadowSVGtoXY()
}, true);
/*
appView.addEventListener("blur",e=>{
    var target = e.target;
    if(target.dataset.textShadow){

    }
},true);*/
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("add-box-shadow"))
    return;
  model.boxShadows.push({
    index: model.boxShadows.length,
    type: "outset",
    color: "rgb(0,0,0)",
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    spread: 0
  });
  model.boxShadow = setShadow();
  t.set("", model);
  inputCss(appView);
  setBoxShadowSVGtoXY();
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("remove-box-shadow"))
    return;
  var index = +e.target.dataset.index;
  model.boxShadows.splice(index, 1);
  model.boxShadow = setShadow();
  if (!model.textShadow)
    model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  else {
    t.set("", model);
    inputCss(appView);
  }
});
appView.addEventListener("imageType", e => { // change from gradient to url
  var value = e.detail.target.value;
  var imageSource;
  if (value == "none")
    imageSource = value;
  else
    imageSource = value == "url" ? urlPlaceholder : "linear-gradient(" + model.realBorderColor + "," + model.realBorderColor + ")";
  setCss("border-image-source", imageSource);
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
var throttleGradientChange;
gradientEl.addEventListener("gradient-change", e => {
  clearTimeout(throttleGradientChange);
  throttleGradientChange = setTimeout(() => {
    var value = e.detail;
    model.borderImageSource = setCss("border-image-source", value);
    t.set("", model);
    inputCss(appView);
  });
});
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("color-button"))
    return;
  var target = e.target;
  var cssProperty = target.dataset.cssProp;
  opener.tilepieces.colorPicker(target.style.backgroundColor).onChange(c => {
    target.style.backgroundColor = c.hex;
    if (cssProperty) {
      model[target.dataset.name] = c.hex;
      model[target.dataset.cssPropJs] = setCss(cssProperty, c.hex);
    } else {
      model.boxShadows[target.dataset.index].color = c.hex;//TODO change with preference
      model.textShadow = setShadow(model.boxShadows);
    }
    t.set("", model);
    inputCss(appView)
  })
});
/*
appView.addEventListener("input",e=>{
    var target = e.target;
    var inputCss = target.querySelector(".input-css");
    if(!inputCss)
        return;
    var cssProp = target.dataset.cssProperty;
    if(!cssProp)
        return;
    setCss(cssProp, inputCss.textContent);
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
appView.addEventListener("css-input-set-text", e => { // handle borders changes
  if (!e.target.classList.contains("input-css"))
    return;
  var inputCss = e.target;
  var cssPropJs = inputCss.dataset.cssPropJs;
  if (cssPropJs.startsWith("border")) {
    model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
  }
});
/*
appView.addEventListener("input",e=>{ // box-shadow
    var target = e.target;
    var inputCss = target.querySelector(".input-css");
    if(!inputCss)
        return;
    var shadow = target.dataset.shadow;
    if(!shadow)
        return;
    model.boxShadows[target.dataset.index][target.dataset.shadow] = inputCss.textContent;
    setShadow();
},true);
appView.addEventListener("change",e=>{ // box-shadow
    var target = e.target;
    var shadow = target.dataset.shadow;
    if(!shadow)
        return;
    model.boxShadows[target.dataset.index][target.dataset.shadow] = target.value;
    setShadow();
},true);*/
function getProp(name, _default) {
  return model._properties[name] ? model._properties[name].value : (_default || model._styles[name]);
}
function mapBoxShadow(boxShadowStat) {
  if (boxShadowStat == "none")
    model.boxShadows = [];
  else {
    var boxShadows = opener.tilepieces.utils.splitCssValue(boxShadowStat);
    model.boxShadows = boxShadows.map((s, index) => {
      var colorMatch = s.match(opener.tilepieces.utils.colorRegex);
      var values = s.match(opener.tilepieces.utils.valueRegex);
      var numberoffsetX = values[0].match(opener.tilepieces.utils.numberRegex);
      var numberoffsetY = values[1].match(opener.tilepieces.utils.numberRegex);
      var blur = values[2] ? values[2].match(opener.tilepieces.utils.numberRegex) : 0;
      var spread = values[3] ? values[3].match(opener.tilepieces.utils.numberRegex) : 0;
      var inset = s.match(/(^|\s)inset($|\s)/);
      return {
        index,
        type: inset ? "inset" : "outset",
        color: colorMatch ? colorMatch[0] : "rgb(0,0,0)",
        offsetX: numberoffsetX ? numberoffsetX[0] : 0,
        offsetY: numberoffsetY ? numberoffsetY[0] : 0,
        blur: blur ? blur[0] : 0,
        spread: spread ? spread[0] : 0
      }
    });
  }
}
appView.addEventListener("click", e => {
  var closest = e.target.closest(".link-button");
  if (!closest)
    return;
  var prop = closest.dataset.prop;
  model[prop + "Link"] = !model[prop + "Link"];
  model[prop + "Unlink"] = !model[prop + "Unlink"];
  t.set("", model);
})
function setShadow() {
  var newBoxShadows = model.boxShadows.map(ts => {
    return (ts.type == "inset" ? "inset " : "") + ts.offsetX + "px " +
      ts.offsetY + "px " + ts.blur + "px " + ts.spread + "px " + ts.color;
  }).join(",");
  return setCss("box-shadow", newBoxShadows);
}
function setBoxShadowSVGtoXY() {
  var textShadowElsDOM = appView.querySelectorAll(".shadow");
  shadows = [...textShadowElsDOM].map(tse => {
    var svg = tse.querySelector("svg");
    var isAlreadyShadow = shadows.find(v => v.target == svg);
    var offsetX = model.boxShadows[tse.dataset.index].offsetX;
    var offsetY = model.boxShadows[tse.dataset.index].offsetY;
    if (!isAlreadyShadow) {
      var newSvgTextShadow = SVGtoXY(svg);
      // 100 = svg width / 2
      // 5 : arbitrary change value on axis
      var throttle = false;
      newSvgTextShadow.onChange((x, y) => {
        if (!throttle) {
          requestAnimationFrame(e => {
            var xAxis = Math.trunc((x - 100) / 5);
            var yAxis = Math.trunc((y - 100) / 5);
            model.boxShadows[svg.dataset.index].offsetX = xAxis;
            model.boxShadows[svg.dataset.index].offsetY = yAxis;
            model.boxShadow = setShadow();
            t.set("", model);
            inputCss(appView);
            throttle = false;
          });
          throttle = true;
        }
      });
      newSvgTextShadow.setXY((offsetX * 5) + 100, (offsetY * 5) + 100);
      return newSvgTextShadow;
    } else {
      isAlreadyShadow.setXY((offsetX * 5) + 100, (offsetY * 5) + 100);
      return isAlreadyShadow;
    }
  });
}
function setCss(name, value) {
  var target = model.elementPresent;
  var setCss = opener.tilepieces.core.setCss(
    target, name, value, model.selector);
  console.log("setcss", name, value);
  return setCss;
}
function setTemplate(e) {
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
  }
  var d = e.detail;
  var properties = d.cssRules.properties;
  model.elementPresent = d.target;
  model._properties = d.cssRules.properties;
  model._styles = d.styles;
  model.border = getProp("border");
  /* border width */
  model.borderWidth = getProp("border-width");
  model.borderWidthLink = (d.styles.borderTopWidth == d.styles.borderLeftWidth &&
    d.styles.borderLeftWidth == d.styles.borderBottomWidth &&
    d.styles.borderBottomWidth == d.styles.borderRightWidth);
  model.borderWidthUnlink = !model.borderWidthLink;
  model.borderTopWidth = getProp("border-top-width");
  model.borderLeftWidth = getProp("border-left-width");
  model.borderBottomWidth = getProp("border-bottom-width");
  model.borderRightWidth = getProp("border-right-width");

  /* border style */
  model.borderStyle = getProp("border-style");
  model.borderStyleLink = (d.styles.borderTopStyle == d.styles.borderLeftStyle &&
    d.styles.borderLeftStyle == d.styles.borderBottomStyle &&
    d.styles.borderBottomStyle == d.styles.borderRightStyle);
  model.borderStyleUnlink = !model.borderStyleLink;
  model.borderTopStyle = getProp("border-top-style");
  model.borderLeftStyle = getProp("border-left-style");
  model.borderBottomStyle = getProp("border-bottom-style");
  model.borderRightStyle = getProp("border-right-style");

  /* border color*/
  model.borderColor = getProp("border-color");
  model.realBorderColor = d.styles.borderColor.match(/rgb\([^)]*\)|rgba\([^)]*\)/)[0];
  model.borderColorLink = (d.styles.borderTopColor == d.styles.borderLeftColor &&
    d.styles.borderLeftColor == d.styles.borderBottomColor &&
    d.styles.borderBottomColor == d.styles.borderRightColor);
  model.borderColorUnlink = !model.borderColorLink;
  model.borderTopColor = getProp("border-top-color");
  model.realBorderTopColor = d.styles.borderTopColor;
  model.borderLeftColor = getProp("border-left-color");
  model.realBorderLeftColor = d.styles.borderLeftColor;
  model.borderBottomColor = getProp("border-bottom-color");
  model.realBorderBottomColor = d.styles.borderBottomColor;
  model.borderRightColor = getProp("border-right-color");
  model.realBorderRightColor = d.styles.borderRightColor;

  /* border radius*/
  model.borderRadius = getProp("border-radius");
  model.borderRadiusLink = (d.styles.borderTopLeftRadius == d.styles.borderTopRightRadius &&
    d.styles.borderTopRightRadius == d.styles.borderBottomRightRadius &&
    d.styles.borderBottomRightRadius == d.styles.borderBottomLeftRadius);
  model.borderRadiusUnlink = !model.borderRadiusLink;
  model.borderTopLeftRadius = getProp("border-top-left-radius");
  model.borderTopRightRadius = getProp("border-top-right-radius");
  model.borderBottomRightRadius = getProp("border-bottom-right-radius");
  model.borderBottomLeftRadius = getProp("border-bottom-left-radius");

  /* border image */
  model.borderImage = getProp("border-image");
  model.borderImageBase = properties["border-image-source"] ?
    properties["border-image-source"].rule.parentStyleSheet.href :
    app.core.currentDocument.location.href;
  model.borderImageSource = getProp("border-image-source");
  var gradient = matchGradients(d.styles.borderImageSource);
  model.hasGradient = !!gradient.length;
  var hasUrl = model.borderImageSource.match(/url\([^)]*\)/);
  model.hasUrl = !!hasUrl;
  var imageSrc = hasUrl ? hasUrl[0].replace("url(", "").replace(/"|'|\)/g, "") : "";
  model.imageSrc = imageSrc ? parsingImageUrl(imageSrc) : "";
  model.imageType = model.hasGradient ? "gradient" : model.hasUrl ? "url" : "none";
  model.borderImageSlice = getProp("border-image-slice");
  model.borderImageWidth = getProp("border-image-width");
  model.borderImageOutset = getProp("border-image-outset");
  model.borderImageRepeat = getProp("border-image-repeat");
  model.boxShadow = getProp("box-shadow");
  mapBoxShadow(d.styles.boxShadow);
  /* outline */
  model.outline = getProp("outline");
  model.outlineWidth = getProp("outline-width");
  model.outlineStyle = getProp("outline-style");
  model.outlineColor = getProp("outline-color");
  model.realOutlineColor = d.styles.outlineColor;
  model.outlineOffset = getProp("outline-offset");

  model.isVisible = true;
  t.set("", model);
  inputCss(appView);
  if (model.hasGradient)
    gradientObject.set(gradient[0]);
  setBoxShadowSVGtoXY()
}

})();