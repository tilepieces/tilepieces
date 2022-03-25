(() => {
  const opener = window.opener || window.parent;
  let app = opener.tilepieces;
  const appView = document.getElementById("fonts");
  const addFont = document.getElementById("add-font");
  const urlRegex = /url\([^)]*\)/;
  const localRegex = /local\([^)]*\)/;
  const formatRegex = /format\([^)]*\)/;
  /*
  opener.addEventListener("edit-page",e=>{
      if(!e.detail)
          t.set("",{isVisible : false});
  });*/
  opener.addEventListener("edit-mode", e => {
    if (!app.editMode)
      t.set("", {isVisible: false});
  });
  /*
  opener.addEventListener("html-rendered",e=>{
      t.set("",{isVisible : false});
  });*/
  let model = {};
  let t;
  tilepieces_tabs({
    el: document.getElementById("font-tabs"),
    noAction: true
  });
//autocomplete(appView);
  if (app.core)
    assignModel({detail: app.core});
  opener.addEventListener("cssMapper-changed", assignModel);
  addFont.addEventListener("click", e => {
    var fonts = model.fonts.slice(0);
    var currentStylesheet = app.core.currentStyleSheet;
    var ffr = fontFaceRule(fontModel);
    if (!currentStylesheet) {
      app.core.createCurrentStyleSheet(ffr);
    } else {
      app.core.insertCssRule(currentStylesheet, ffr);
      var index = currentStylesheet.cssRules.length;
      var rule = currentStylesheet.cssRules[index - 1];
      var mapped = {
        fontFamily: "",
        fontWeight: "",
        fontStyle: "",
        fontDisplay: "",
        unicodeRange: "",
        fontStretch: "",
        fontVariant: "",
        fontFeatureSettings: "",
        fontVariationSettings: "",
        src: ""
      };
      app.core.styles.fonts.push({mapped, fontFaceRule: rule, cssText: rule.cssText});
      assignModel({detail: app.core});
    }
  });

  function assignModel(e) {
    var f = e.detail.styles && e.detail.styles.fonts;
    var fonts = f || [];
    var newFonts = fonts.reverse().map((font, index) => {
      var newFont = {};
      newFont.fontFaceRule = font.fontFaceRule;
      newFont.cssText = font.cssText;
      newFont.mapped = font.mapped;
      var src = newFont.mapped.src;
      var srcResources = !src ? [] : app.utils.splitCssValue(src);
      newFont.disabled = font.fontFaceRule.parentStyleSheet != e.detail.currentStyleSheet ?
        "disabled" : "";
      newFont.index = index;
      newFont.srcResources = srcResources.map((srcRes, index) => {
        var url = srcRes.match(urlRegex);
        var type;
        if (url) {
          url = url[0].substring(0, url[0].length - 1).replace(/url\(/g, "");
          type = "url";
        } else url = "";
        var format = srcRes.match(formatRegex);
        if (format) {
          format = format[0].substring(0, format[0].length - 1).replace(/format\(/g, "");
        } else format = "";
        var local = srcRes.match(localRegex);
        if (local) {
          local = local[0].substring(0, local[0].length - 1).replace(/local\(/g, "");
          type = "local";
        } else local = "";
        return {url, format, local, type, index};
      });
      newFont.isSelected = index == 0 ? "selected" : ""; // 0 is selected, others not
      return newFont;
    });
    model = {
      fonts: newFonts
    };
    if (!t)
      t = new opener.TT(appView, model);
    else
      t.set("", model);
  }

  function changeTab(e) {
    if (e.target.classList.contains("true"))
      return;
    var exSel = model.fonts.find(f => f.isSelected);
    exSel.isSelected = "";
    model.fonts[e.target.dataset.targetIndex].isSelected = "selected";
    t.set("", model);
  }

  appView.addEventListener("click", e => {
    if (e.target.classList.contains("tab-link"))
      changeTab(e);
  });

  function fontFaceRule(fontModel) {
    var fontFace =
      `@font-face {
        src : ${fontModel.srcResources.map(src => {
        if (src.type == "local")
          return `local(${src.local})`;
        else
          return `url(${src.url})${src.format ? ` format(${src.format})` : ""}`;
      })};
        font-family : ${fontModel.mapped.fontFamily};
        ${fontModel.mapped.fontWeight ? `font-weight : ${fontModel.mapped.fontWeight};` : ``}
        ${fontModel.mapped.fontStyle ? `font-style : ${fontModel.mapped.fontStyle};` : ``}
        ${fontModel.mapped.fontDisplay ? `font-display : ${fontModel.mapped.fontDisplay};` : ``}
        ${fontModel.mapped.unicodeRange ? `unicode-range : ${fontModel.mapped.unicodeRange};` : ``}
        ${fontModel.mapped.fontStretch ? `font-stretch : ${fontModel.mapped.fontStretch};` : ``}
        ${fontModel.mapped.fontVariant ? `font-variant : ${fontModel.mapped.fontVariant};` : ``}
        ${fontModel.mapped.fontFeatureSettings ? `font-feature-settings : ${fontModel.mapped.fontFeatureSettings};` : ``}
        ${fontModel.mapped.fontVariationSettings ? `font-variation-settings : ${fontModel.mapped.fontVariationSettings};` : ``}
    }`;
    return fontFace
  }

  let fontModel = {
    src: "",
    srcResources: [],
    mapped: {
      fontFamily: "",
      fontWeight: "",
      fontStyle: "",
      fontDisplay: "",
      unicodeRange: "",
      fontStretch: "",
      fontVariant: "",
      fontFeatureSettings: "",
      fontVariationSettings: ""
    },
    disabled: "",
    index: 0
  };
  appView.addEventListener("template-digest", ev => {
    var e = ev.detail;
    if (e.target.classList.contains("change-src-type")) {
      console.log(e.target.value);
      return;
    }
    var font = e.target.closest(".font");
    var fontModel = model.fonts[font.dataset.index];
    var rule = fontModel.fontFaceRule;
    var parentStyles = rule.parentRule || rule.parentStyleSheet || app.core.currentStyleSheet;
    fontModel.mapped.src = fontModel.srcResources.map(src => {
      if (src.type == "local")
        return `local(${src.local})`;
      else
        return `url(${src.url})${src.format ? ` format(${src.format})` : ""}`;
    }).join(",");
    var fontIndexRule = -1;
    if (parentStyles) {
      fontIndexRule = [...parentStyles.cssRules].indexOf(rule);
      if (fontIndexRule > -1)
        app.core.deleteCssRule(rule);
    }
    var ffr = fontFaceRule(fontModel);
    var newRule = app.core.insertCssRule(parentStyles, ffr, fontIndexRule > -1 ? fontIndexRule : parentStyles.cssRules.length);
    var fontObj = {mapped: fontModel.mapped, fontFaceRule: newRule, cssText: newRule.cssText};
    var alreadyInFont = app.core.styles.fonts.findIndex(f => f.fontFaceRule == rule);
    if (alreadyInFont > -1)
      app.core.styles.fonts.splice(alreadyInFont, 1, fontObj);
    else
      app.core.styles.fonts.push(fontObj);
    assignModel({detail: app.core});
  }, true);

  appView.addEventListener("click", e => {
    var target = e.target;
    var font = target.closest(".font");
    if (target.classList.contains("add-src")) {
      var srcResources = model.fonts[font.dataset.index].srcResources.splice(0);
      srcResources.push({url: "", format: "", local: "", type: "url"});
      srcResources = srcResources.map((v, i) => {
        v.index = i;
        return v;
      });
      t.set("fonts[" + font.dataset.index + "].srcResources", srcResources);
    }
    if (target.classList.contains("remove-src")) {
      var srcResources = model.fonts[font.dataset.index].srcResources.splice(0);
      srcResources.splice(Number(target.dataset.indexSrc), 1);

      t.set("fonts[" + font.dataset.index + "].srcResources", srcResources);
      var fontFamilyInputToTrigger = font.querySelector(".font-family");
      fontFamilyInputToTrigger.dispatchEvent(new Event("change"))
    }
    if (target.classList.contains("remove-font")) {
      var ffr = model.fonts[font.dataset.index].fontFaceRule;
      app.core.deleteCssRule(ffr);
      assignModel({detail: app.core});
    }
  })
  appView.addEventListener("dropzone-dropping", onDropFiles, true);

  async function onDropFiles(e) {
    e.preventDefault();
    var dropzone = e.detail.target;
    var file = e.detail.files[0];
    if (!file)
      return;
    var font = e.target.closest(".font");
    var fontModel = model.fonts[font.dataset.index];
    var index = +dropzone.nextElementSibling.dataset.index;
    var result = await app.utils.processFile(file, null, app.core.currentStylesheet?.href?.replace(location.origin, ""));
    fontModel.srcResources[index].url = result;
    appView.dispatchEvent(new CustomEvent("template-digest", {detail: {target: e.target}}))
  }

  appView.addEventListener("click", e => {
    if (!e.target.classList.contains("search-button"))
      return;
    var font = e.target.closest(".font");
    var fontModel = model.fonts[font.dataset.index];
    var index = +e.target.dataset.index;
    var dialogSearch = opener.dialogReader("fonts", app.core.currentStylesheet?.href?.replace(location.origin, ""));
    dialogSearch.then(dialog => {
      dialog.on("submit", src => {
        fontModel.srcResources[index].url = src;
        appView.dispatchEvent(new CustomEvent("template-digest", {detail: {target: e.target}}))
      })
    })
  });


})();