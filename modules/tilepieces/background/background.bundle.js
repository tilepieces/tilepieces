(()=>{
const opener = window.opener || window.parent;
let app = opener.tilepieces;
window.cssDefaults = app.cssDefaultValues;
let gradientIsChanging;
const appView = document.getElementById("background-box");
const addBackgroundButton = appView.querySelector("#add-background");
const urlPlaceholder = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=)";
appView.addEventListener("click", e => {
  if (e.target.classList.contains("tab-link"))
    changeTab(e);
  if (e.target.classList.contains("remove-background"))
    removeBackground(e);
});
addBackgroundButton.addEventListener("click", addBackground);
let gradientsEls = [];
//opener.addEventListener("WYSIWYG-el-parsed", setTemplate);
opener.addEventListener("highlight-click", setTemplate);
opener.addEventListener("deselect-element", e => {
  t.set("isVisible", false)
});
opener.addEventListener("frame-unload", e => {
  t.set("isVisible", false)
});
let model = {
  isVisible: false,
  backgrounds: [],
  tabActive: 0
};
let t = new opener.TT(appView, model, {
  templates: [{
    name: "gradient-template",
    el: document.getElementById("gradient-template").content
  }]
});
autocomplete(appView);
if (app.elementSelected)
  setTemplate({detail: app.cssSelectorObj});

tilepieces_tabs({
  el: document.getElementById("background-tabs"),
  noAction: true
});
function parsingImageUrl(url){
  if(url.startsWith("data:image") || url.match(app.utils.URLIsAbsolute))
      return url;
  if(url.startsWith("/"))
    return app.utils.getResourceAbsolutePath(url);
  return new URL(url,model.backgroundImageBase).href
}
function addBackground() {
  //var templateToAdd = "linear-gradient(" + model.backgroundColor + "," + model.backgroundColor + ")";
  var templateToAdd = urlPlaceholder;
  var newBackground;
  if (model.backgroundImage == "initial" || model.backgroundImage == "unset" ||
    model.backgroundImage == "inherit" || model.backgroundImage == "none") {
    newBackground = templateToAdd
  } else {
    newBackground = model.backgroundImage + "," + templateToAdd;
    model.tabToSelect = model.backgrounds.length;
  }
  setCss("background-image", newBackground);
  var exSel = model.backgrounds.find(f => f.isSelected);
  exSel.isSelected = "";
  model.tabToSelect = model.backgrounds.length;
  setBgModel(templateToAdd, model.tabToSelect);
  t.set("", model);
  inputCss(appView);
}

function removeBackground(e) {
  var index = +e.target.dataset.index;
  model.backgroundsImages.splice(index, 1);
  model.backgrounds.splice(index, 1);
  var newBackground = model.backgroundsImages.join(",") || "none";
  model.backgroundImage = newBackground;
  model.tabToSelect = index - 1 > -1 ? index - 1 : 0;
  model.backgrounds.forEach((v, i) => {
    if (i == model.tabToSelect) {
      v.isSelected = "selected";
    } else v.isSelected = "";
    v.index = i;
  });
  setCss("background-image", newBackground);
  t.set("", model);
}
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("color-button"))
    return;
  var target = e.target;
  var cssProperty = target.dataset.cssProp;
  var throttle;
  app.colorPicker(target.style.backgroundColor).onChange(c => {
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      model.realBgColor = c.hex;
      var newColor = setCss(cssProperty, c.hex);
      model.backgroundColor = newColor;
      t.set("", model);
      inputCss(appView)
    }, 32)
  })
})
appView.addEventListener("change", e => { // change from gradient to url
  if (!e.target.classList.contains("image-type-select"))
    return;
  var value = e.target.value;
  var index = +e.target.dataset.index;
  if (value == "url") {
    model.backgrounds[index].backgroundImage = urlPlaceholder;
    var exGradient = e.target.parentNode.querySelector(".gradient");
    if (exGradient) {
      var i = gradientsEls.findIndex(v => v.gradientDOM == exGradient);
      gradientsEls.splice(i, 1);
    }
  } else
    model.backgrounds[index].backgroundImage = "linear-gradient(" + model.backgroundColor + "," + model.backgroundColor + ")";
  setCss("background-image", createNewBgProp("backgroundImage"));
  setBgModel(model.backgrounds[index].backgroundImage, index);
  t.set("", model);
  if (value != "url")
    gradientsEls.push(createNewGradient(e.target.parentNode.querySelector(".gradient"), index));
  inputCss(appView);
}, true);
appView.addEventListener("input", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  var inputCss = e.target;
  var cssProp = inputCss.dataset.cssProp;
  if (!cssProp)
    return;
  var cssPropJs = inputCss.dataset.cssPropJs;
  /*
  if(cssPropJs=="backgroundImage")
      return;*/
  var newRule;
  var index;
  if (cssPropJs != "backgroundColor") {
    index = +inputCss.closest(".backgrounds").dataset.index;
    model.backgrounds[index][cssPropJs] = inputCss.innerText;
    newRule = createNewBgProp(cssPropJs);
  } else
    newRule = inputCss.innerText;
  setCss(cssProp, newRule);
}, true);
appView.addEventListener("css-input-set-text", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  var inputCss = e.target;
  var cssPropJs = inputCss.dataset.cssPropJs;
  if (cssPropJs != "backgroundImage")
    return;
  var index = +inputCss.closest(".backgrounds").dataset.index;
  model.backgrounds[index][cssPropJs] = inputCss.innerText;
  var realNewValue = setCss("background-image", createNewBgProp("backgroundImage"));
  realNewValue = matchBackgrounds(realNewValue)[index];
  if (cssPropJs == "backgroundImage") {
    setBgModel(realNewValue, +inputCss.closest(".backgrounds").dataset.index);
    t.set("", model);
    if (model.backgrounds[index].hasGradient) {
      var gradient = appView.querySelector(".backgrounds[data-index='" + index + "'] .gradient");
      var isAlreadyGradientObject = gradientsEls.find(v => gradient);
      if (!isAlreadyGradientObject)
        gradientsEls.push(createNewGradient(gradient, index));
      else
        isAlreadyGradientObject.set(model.backgrounds[index].gradientModel);
    }
  }
}, true);
appView.addEventListener("blur", e => {
  if (!e.target.classList.contains("input-css"))
    return;
  if (!e.target.dataset.cssProp)
    return;
  if (e.target.dataset.value == e.target.innerText)
    return;
  model.elementPresent.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
}, true);
/*
appView.addEventListener("blur",e=>{
    if(!e.target.classList.contains("input-css"))
        return;
    var inputCssEl = e.target;
    var cssProp = inputCssEl.dataset.cssProp;
    var cssPropJs = inputCssEl.dataset.cssPropJs;
    if(!cssProp)
        return;
    var realNewRule = inputCssEl.dataset.realNewValue;
    if(cssPropJs != "backgroundImage" &&
        typeof realNewRule != "string")
        return;
    var index;
    if(realNewRule!=inputCssEl.innerText) {
        if (cssPropJs != "backgroundColor" && cssPropJs != "backgroundImage") {
            index = +inputCssEl.closest(".backgrounds").dataset.index;
            model.backgrounds[index][cssPropJs] = realNewRule;
        }
        else if(cssPropJs == "backgroundImage"){
            index = +inputCssEl.closest(".backgrounds").dataset.index;
            model.backgrounds[index][cssPropJs] = inputCssEl.innerText;
            var realNewValue = setCss("background-image", createNewBgProp("backgroundImage"));
            model.backgrounds[index][cssPropJs] = matchBackgrounds(realNewValue)[index] || "none";
        }
        else
            model.backgroundColor = realNewRule;
    }
    delete inputCssEl.dataset.realNewValue;
    if(cssPropJs=="backgroundImage") {
        setBgModel(model.backgrounds[index].backgroundImage, index);
        t.set("", model);
        if(model.backgrounds[index].hasGradient){
            var gradient = appView.querySelector(".backgrounds[data-index='" + index + "'] .gradient");
            var isAlreadyGradientObject = gradientsEls.find(v=>gradient)
            if(!isAlreadyGradientObject)
                gradientsEls.push(createNewGradient(gradient,index));
            else
                isAlreadyGradientObject.set(model.backgrounds[index].gradientModel);
        }
    }
    else
        t.set("", model);
    inputCss(appView);
},true);
    */
function changeTab(e) {
  if (e.target.classList.contains("true"))
    return;
  //var backgrounds = model.backgrounds.slice(0);
  var exSel = model.backgrounds.find(f => f.isSelected);
  exSel.isSelected = "";
  var index = +e.target.dataset.targetIndex;
  model.backgrounds[index].isSelected = "selected";
  model.tabToSelect = index;
  t.set("backgrounds", model.backgrounds);
}
function createNewBgProp(prop) {
  return model.backgrounds.reduce((string, v, i, a) => {
    string += v[prop] + (i != a.length - 1 ? "," : "");
    return string
  }, "");
}
function createNewGradient(gEl, index) {
  var throttle;
  gEl.addEventListener("gradient-change", e => {
    model.backgrounds[index].backgroundImage = e.detail;
    clearTimeout(throttle);
    throttle = setTimeout(() => {
      setCss("background-image", createNewBgProp("backgroundImage"));
      t.set("", model);
      inputCss(appView);
    }, 32);
  });
  return gradientView(gEl, model.backgrounds[index].gradientModel, true);
}
function changeUrlBackground(URL, index) {
  model.backgrounds[index].backgroundImage = "url(" + URL + ")";
  model.backgrounds[index].imageSrc = parsingImageUrl(URL);
  setCss("background-image", createNewBgProp("backgroundImage"));
  t.set("", model);
  inputCss(appView);
}

appView.addEventListener("change", e => {
  if (e.target.dataset.type != "url-background") return;
  var index = e.target.dataset.index;
  var files = e.target.files;
  app.utils.processFile(files[0]).then(res => {
    if (res) changeUrlBackground(res, index)
  })
});
window.addEventListener("dropzone-dropping", e => {
  if (e.detail.target.dataset.type != "url-background") return;
  var index = e.detail.target.dataset.index;
  var type = e.detail.type;
  var currentStyleSheet = app.core.currentStyleSheet;
  var relativeToWhat = currentStyleSheet?.href?.replace(location.origin + "/", "");
  if (type == "files")
    app.utils.processFile(e.detail.files[0], null, relativeToWhat).then(res => {
      if (res) changeUrlBackground(res, index)
    });
  else {
    var img = e.detail.placeholderHTML.querySelector("img");
    if (img) changeUrlBackground(img.src, index)
  }
});
appView.addEventListener("click", e => {
  var target = e.target.closest("[dropzone]");
  if (!target)
    return;
  var index = target.dataset.index;
  if (target && !target.classList.contains("ondrop")) {
    var currentStyleSheet = app.core.currentStyleSheet;
    var relativeToWhat = currentStyleSheet?.href?.replace(location.origin + "/", "");
    var imageSearch = dialogReader("img", relativeToWhat);
    imageSearch.then(imageSearchDialog => {
      imageSearchDialog.on("submit", res => changeUrlBackground(res, index));
    }, e => {
      opener.dialog.open(e.toString());
      console.error(e);
    })
  }
});
function matchBackgrounds(cssBackgroundStyle) {
  var swap = cssBackgroundStyle;
  var cursor = 0;
  var tokens = [];
  var backgrounds = [];
  var background = "";
  var currentToken;
  while (cursor < swap.length) {
    var sub = swap.substring(cursor);
    if (sub[0] == '(') {
      var newcurrentToken = {start: cursor, childs: [], father: currentToken || tokens};
      if (currentToken && currentToken != tokens) {
        currentToken.childs.push(newcurrentToken);
        currentToken = newcurrentToken;
      } else {
        tokens.push(newcurrentToken);
        currentToken = newcurrentToken
      }
    }
    if (sub[0] == ')') {
      currentToken.end = cursor + 1;
      currentToken = currentToken.father;
    }
    if (sub[0] == "," && (!currentToken || currentToken == tokens)) {
      backgrounds.push(background.trim());
      background = "";
    } else if (cursor == swap.length - 1) {
      background += sub[0];
      backgrounds.push(background.trim());
    } else
      background += sub[0];
    cursor += 1;
  }
  return backgrounds;
}
// type : 0 up, 1 down
function moveBackground(type, index) {
  var moveIndex = type ? index + 1 : index - 1;
  var swap = model.backgrounds[index];
  model.backgrounds[index] = model.backgrounds[moveIndex];
  model.backgrounds[index].index = index;
  model.backgrounds[moveIndex] = swap;
  model.backgrounds[moveIndex].index = moveIndex;
  setCss("background-image", createNewBgProp("backgroundImage"));
  setCss("background-repeat", createNewBgProp("backgroundRepeat"));
  setCss("background-position", createNewBgProp("backgroundPosition"));
  setCss("background-origin", createNewBgProp("backgroundOrigin"));
  setCss("background-clip", createNewBgProp("backgroundClip"));
  setCss("background-attachment", createNewBgProp("backgroundAttachment"));
  setCss("background-size", createNewBgProp("backgroundSize"));
  setCss("background-blend-mode", createNewBgProp("backgroundBlendMode"));
  model.tabToSelect = moveIndex;
  t.set("", model);
  if (model.backgrounds[index].hasGradient)
    gradientsEls.push(createNewGradient(appView.querySelector(".backgrounds[data-index='" + index + "'] .gradient"), index));
  if (model.backgrounds[moveIndex].hasGradient)
    gradientsEls.push(createNewGradient(appView.querySelector(".backgrounds[data-index='" + moveIndex + "'] .gradient"), moveIndex));
  inputCss(appView);
}

appView.addEventListener("click", e => {
  if (!e.target.classList.contains("move-background-up")) return;
  moveBackground(0, +e.target.dataset.index);
})
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("move-background-down")) return;
  moveBackground(1, +e.target.dataset.index);
})
function setBgModel(bi, i) {
  var newB = {};
  newB.index = i;
  var gradient = matchGradients(bi);
  newB.hasGradient = !!gradient.length;
  newB.hasUrl = bi.match(/url\([^)]*\)/);
  var imageSrc = newB.hasUrl ? newB.hasUrl[0].replace("url(", "").replace(/"|'|\)/g, "") : "";
  newB.imageSrc = parsingImageUrl(imageSrc);
  newB.imageType = newB.hasGradient ? "gradient" : newB.hasUrl ? "url" : "";
  newB.gradientModel = gradient.length ? gradient[0] : null;
  newB.backgroundImage = bi;
  var bg = model.backgrounds[i] || {};
  newB.backgroundRepeat = bg.backgroundRepeat || model.backgroundsRepeat[i] || "repeat";
  newB.backgroundPositionX = bg.backgroundPositionX || model.backgroundsPositionX[i] || "0%";
  newB.backgroundPositionY = bg.backgroundPositionY || model.backgroundsPositionY[i] || "0%";
  newB.backgroundOrigin = bg.backgroundOrigin || model.backgroundsOrigin[i] || "padding-box";
  newB.backgroundClip = bg.backgroundClip || model.backgroundsClip[i] || "border-box";
  newB.backgroundAttachment = bg.backgroundAttachment || model.backgroundsAttachment[i] || "scroll";
  newB.backgroundSize = bg.backgroundSize || model.backgroundsSize[i] || "auto auto";
  newB.backgroundBlendMode = bg.backgroundBlendMode || model.backgroundsBlendMode[i] || "normal";
  console.log(model.tabToSelect);
  newB.isSelected = i == model.tabToSelect ? "selected" : "";
  model.backgrounds[i] = newB;
}
let setCssRefreshThrottle;

function setCss(name, value) {
  var target = model.elementPresent;
  var setCss = app.core.setCss(target, name, value);
  console.log("setcss", name, value);
  return setCss;
  //target.dispatchEvent(new PointerEvent("pointerdown",{bubbles: true}));
}
function setGradientEls() {
  return [...appView.querySelectorAll(".gradient")].map(gEl => {
    var isAlreadyGradientObject = gradientsEls.find(v => v.gradientDOM == gEl);
    var index = +gEl.closest(".backgrounds").dataset.index;
    if (!isAlreadyGradientObject)
      return createNewGradient(gEl, index);
    else {
      isAlreadyGradientObject.set(model.backgrounds[index].gradientModel);
      return isAlreadyGradientObject;
    }
  });
}
function setTemplate(e) {
  if (appView.style.display == "none" || appView.hidden) // in css viewer
    return;
  if (e && e.detail && e.detail.target.nodeType != 1) {
    model.isVisible = false;
    t.set("", model);
    return;
  }
  var d = e.detail;
  model.match = d.match;
  model.isVisible = true;
  var properties = d.cssRules.properties;
  model.backgroundColor = properties["background-color"] ? properties["background-color"].value :
    d.styles.backgroundColor;
  model.realBgColor = d.styles.backgroundColor;
  if (d.target != model.elementPresent)
    model.tabToSelect = 0;
  model.elementPresent = d.target;
  model.backgroundImageBase = properties["background-image"]?.rule.parentStyleSheet.href || app.core.currentDocument.location.href;
  var backgroundImage = properties["background-image"] ?
    properties["background-image"].value : d.styles.backgroundImage;
  model.backgroundImage = backgroundImage;
  model.backgroundsImages = matchBackgrounds(backgroundImage);
  var backgroundRepeat = properties["background-repeat"] ? properties["background-repeat"].value
    : d.styles.backgroundRepeat;
  model.backgroundsRepeat = backgroundRepeat.split(",").map(v => v.trim());

  var backgroundPositionX = properties["background-position-x"] ?
    properties["background-position-x"].value : d.styles.backgroundPositionX;
  model.backgroundsPositionX = backgroundPositionX.split(",").map(v => v.trim());

  var backgroundPositionY = properties["background-position-y"] ?
    properties["background-position-y"].value : d.styles.backgroundPositionY;
  model.backgroundsPositionY = backgroundPositionY.split(",").map(v => v.trim());

  var backgroundSize = properties["background-size"] ?
    properties["background-size"].value : d.styles.backgroundSize;
  model.backgroundsSize = backgroundSize.split(",").map(v => v.trim());

  var backgroundAttachment = properties["background-attachment"] ?
    properties["background-attachment"].value : d.styles.backgroundAttachment;
  model.backgroundsAttachment = backgroundAttachment.split(",").map(v => v.trim());

  var backgroundClip = properties["background-clip"] ?
    properties["background-clip"].value : d.styles.backgroundClip;
  model.backgroundsClip = backgroundClip.split(",").map(v => v.trim());

  var backgroundOrigin = properties["background-origin"] ?
    properties["background-origin"].value : d.styles.backgroundOrigin;
  model.backgroundsOrigin = backgroundOrigin.split(",").map(v => v.trim());

  var backgroundBlendMode = properties["background-blend-mode"] ?
    properties["background-blend-mode"].value : d.styles.backgroundBlendMode;
  model.backgroundsBlendMode = backgroundBlendMode.split(",").map(v => v.trim());
  model.backgrounds = [];
  model.backgroundsImages.forEach(setBgModel);
  t.set("", model);
  gradientsEls = [...appView.querySelectorAll(".gradient")].map(gEl => {
    var isAlreadyGradientObject = gradientsEls.find(v => v.gradientDOM == gEl);
    var index = +gEl.closest(".backgrounds").dataset.index;
    if (!isAlreadyGradientObject)
      return createNewGradient(gEl, index);
    else {
      isAlreadyGradientObject.set(model.backgrounds[index].gradientModel);
      return isAlreadyGradientObject;
    }
  });
  inputCss(appView);
}


})();