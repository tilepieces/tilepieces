(()=>{
window.addEventListener("WYSIWYG-end", () => {
  tilepieces.lastEditable = null;
});
TilepiecesCore.prototype.contenteditable = function (target) {
  tilepieces.lastEditable = tilepieces.core.htmlMatch.contenteditable(target);
}
// https://bugs.chromium.org/p/chromium/issues/detail?id=922618&q=stylesheet%20href%20change&can=2
// can't use onload on chrome already added nodes even changing the href.
// however, maybe that's the only way ( safari has problem too )
TilepiecesCore.prototype.fetchingStylesheet = function (href) {
  var $self = this;
  return new Promise((resolve, reject) => {
    if(!href.match(tilepieces.utils.URLIsAbsolute)){
      var hrefParsed = href[0] == "/" ? encodeURI(app.utils.paddingURL(app.frameResourcePath())) + href.substring(1) : href;
      href = new URL(hrefParsed, tilepieces.core.currentWindow.location.href)
    }
    fetch(href).then(res => {
      if (res.status != 200) {
        console.error("[error loading stylesheet, status != 200]->", res);
        reject(res)
      } else {
        var contentType = res.headers.get('Content-Type');
        var contentTypeTokens = contentType ? contentType.split(";") : [];
        if (contentTypeTokens.find(v => v.trim() == "text/css"))
          resolve();
        else {
          console.error("[error loading stylesheet, content-type mismatch]->", res);
          reject(res)
        }
      }
    }, err => {
      console.error("[error loading stylesheet]->", err);
      reject(err)
    });
  })
}

function longPollingStyleSheet(style, cb) {
  if (!style.sheet) {
    setTimeout(() => {
      longPollingStyleSheet(style, cb)
    });
  } else cb();
}

function findGeneratorIndexes($self) {
  var doc = $self.currentDocument;
  var idGenerator = tilepieces.idGenerator;
  var classGenerator = tilepieces.classGenerator;
  var templates, classSearch, els;
  if (classGenerator) {
    var classMatch = new RegExp(`${classGenerator}\\d+$`);
    templates = doc.querySelectorAll("template");
    classSearch = `[class^="${classGenerator}"]`;
    els = [...doc.querySelectorAll(classSearch)];
    [...templates].forEach(t => {
      els = els.concat([...t.content.querySelectorAll(classSearch)])
    });
    els.forEach(e => [...e.classList].forEach(v => {
      if (v.match(classMatch)) {
        var number = v.match(/\d+/);
        if (!number)
          return;
        number = Number(number[0]);
        if (number > $self.classIndex)
          $self.classIndex = number;
      }
    }))
  }
  if (idGenerator) {
    var idMatch = new RegExp(`${idGenerator}\\d+$`);
    templates = doc.querySelectorAll("template");
    var idSearch = `[id^="${idGenerator}"]`;
    els = [...doc.querySelectorAll(idSearch)];
    [...templates].forEach(t => {
      els = els.concat([...t.content.querySelectorAll(idSearch)])
    });
    els.forEach(e => {
      var m = e.id.match(idMatch);
      if (!m)
        return;
      var number = m[0].match(/\d+/);
      if (!number)
        return;
      number = Number(number[0]);
      if (number > $self.idIndex)
        $self.idIndex = number;
    })
  }
}
window.addEventListener("cssMapper-changed", e => {
  var styleParsed = e.detail.styles;
  var defaults = tilepieces.cssDefaultValues["font-family"];
  styleParsed.fontDeclarations.forEach(f => {
    if (!e.detail.fontAlreadyDeclared.find(v => v == f) &&
      !defaults.find(v => v == f))
      e.detail.fontAlreadyDeclared.push(f);
  });
  styleParsed.fonts.forEach(f => {
    if (f.mapped.fontFamily &&
      !e.detail.fontAlreadyDeclared.find(v => v == f.mapped.fontFamily) &&
      !defaults.find(v => v == f.mapped.fontFamily) &&
      e.detail.currentDocument.fonts.check("12px " + f.mapped.fontFamily))
      e.detail.fontAlreadyDeclared.push(f.mapped.fontFamily);
  });
  e.detail.fontSuggestions = e.detail.fontAlreadyDeclared.concat(defaults);
});
function getUnitProperties(d, prop) {
  var declarationMatchInCss = d.cssRules.matchStyle(prop);
  var declaration = declarationMatchInCss ? declarationMatchInCss.value : d.styles[prop];
  var numberValue = declaration ? declaration.match(regexNumbers) : null;
  if (!numberValue)
    return {
      name: prop,
      value: declaration,
      declaration
    };
  else
    return {
      name: prop,
      value: numberValue[0],
      declaration,
      unit: declaration.replace(numberValue, "")
    }
}
let iframeTest = document.querySelector("iframe");
let highlightOver = document.createElement("div");
highlightOver.id = "highlight-over";
let selectionDiv = document.createElement("div");
selectionDiv.className = "highlight-selection";
selectionDiv.tabIndex = "1";
let paddingDiv = document.createElement("div");
paddingDiv.className = "highlight-element__padding";
let marginDiv = document.createElement("div");
marginDiv.className = "highlight-element__margin";
let borderDiv = document.createElement("div");
borderDiv.className = "highlight-element__border";
document.body.append(highlightOver, selectionDiv, paddingDiv, marginDiv, borderDiv);

let drawSelection;//requestAnimationFrame reference
window.tilepieces = {
  version : "0.1.20",
  projects: [],
  globalComponents: [],
  localComponents: [],
  isComponent: false,
  currentProject: null,
  fileSelected: {},
  applicationName: "tilepieces",
  componentPath: "components",
  componentAttribute: "data-tilepieces-component",
  currentStyleSheetAttribute: "data-tilepieces-current-stylesheet",
  currentPage: {},
  core: null,
  panels: [],
  lastEditable: null,
  multiselections: [],
  editMode: "",
  name: "tilepieces",
  editElements: {
    highlight: highlightOver,
    selection: selectionDiv,
    paddingDiv,
    marginDiv,
    borderDiv,
    padding: null,
    border: null,
    margin: null
  },
  relativePaths: false,
  imageDir: "images",
  miscDir: "miscellaneous",
  frame: iframeTest,
  panelPosition: "right",
  idGenerator: "app-",
  classGenerator: "app-",
  getFilesAsDataUrl: true,
  insertionMode: 'append',
  storageInterface: window.storageInterface,
  delayUpdateFileMs: 500,
  sandboxFrame: true,
  waitForStyleSheetLoadMs: 10000,
  imageTypeProcess: window.storageInterface ? 0 : 64, // 64 : base64
  insertStyleSheets: "stylesheet",// stylesheet,inline,inline!important
  menuFileList: [],
  htmlDefaultPath: "html",
  jsDefaultPath: "js",
  cssDefaultPath: "css",
  workspace: "www",
  terserConfiguration: {compress: false, mangle: false},
  frameResourcePath: () => tilepieces.workspace ? (tilepieces.workspace + "/" + (tilepieces.currentProject || "")).replace(/\/+/g, "/") : "",
  serviceWorkers: [],
  skipMatchAll : true,
  utils: {
    numberRegex: /[+-]?\d+(?:\.\d+)?|[+-]?\.\d+?/,
    colorRegex: /rgb\([^)]*\)|rgba\([^)]*\)|#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b|hsl\([^)]*\)|hsla\([^)]*\)/g,
    valueRegex: /([+-]?\d+(?:\.\d+)?|[+-]?\.\d+?)(em|ex|ch|rem|vh|vw|vmin|vmax|cm|mm|in|px|pt|pc|fr)/g,
    // Phrasing content ( https://html.spec.whatwg.org/#phrasing-content )
    // Heading content ( https://html.spec.whatwg.org/#heading-content )
    // Embedded content
    // interactive content minus a
    // https://stackoverflow.com/questions/9852312/list-of-html5-elements-that-can-be-nested-inside-p-element
    // minus A,
    tagWhereCannotInsertOthers: /^(P|H1|H2|H3|H4|H5|H6|ABBR|AUDIO|B|BDI|BDO|BR|BUTTON|CANVAS|CITE|CODE|DATA|DATALIST|DEL|DFN|EM|EMBED|I|IFRAME|IMG|INPUT|INS|HR|KBD|LABEL|MAP|MARK|METER|NOSCRIPT|OBJECT|OUTPUT|PICTURE|PROGRESS|Q|RUBY|SAMP|SCRIPT|SELECT|SLOT|SMALL|SPAN|STRONG|SUB|SUP|SVG|TEMPLATE|TEXTAREA|TIME|U|UL|OL|DL|VAR|VIDEO|WBR)$/,
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories
    flowTags: /^(A|ABBR|ADDRESS|ARTICLE|ASIDE|AUDIO|B|BDO|BDI|BLOCKQUOTE|BR|BUTTON|CANVAS|CITE|CODE|COMMAND|DATA|DATALIST|DEL|DETAILS|DFN|DIV|DL|EM|EMBED|FIELDSET|FIGURE|FOOTER|FORM|H1|H2|H3|H4|H5|H6|HEADER|HGROUP|HR|I|IFRAME|IMG|INPUT|INS|KBD|KEYGEN|LABEL|MAIN|MAP|MARK|MATH|MENU|METER|NAV|NOSCRIPT|OBJECT|OL|OUTPUT|P|PICTURE|PRE|PROGRESS|Q|RUBY|S|SAMP|SCRIPT|SECTION|SELECT|SMALL|SPAN|STRONG|SUB|SUP|SVG|TABLE|TEMPLATE|TEXTAREA|TIME|UL|VAR|VIDEO|WBR)$/,
    phrasingTags: /^(A|ABBR|AUDIO|B|BDI|BDO|BR|BUTTON|CANVAS|CITE|CODE|DATA|DATALIST|DEL|DFN|EM|EMBED|I|IFRAME|IMG|INPUT|INS|KBD|LABEL|MAP|MARK|METER|NOSCRIPT|OBJECT|OUTPUT|PICTURE|PROGRESS|Q|RUBY|SAMP|SCRIPT|SELECT|S|SLOT|SMALL|SPAN|STRONG|SUB|SUP|SVG|TEMPLATE|TEXTAREA|TIME|U|VAR|VIDEO|WBR)$/,
    notInsertableTags: /^(UL|OL|DL|TABLE|COL|COLGROUP|TBODY|THEAD|TFOOT|TR)$/,
    embeddedContentTags: /AUDIO|CANVAS|EMBED|IFRAME|IMG|MATH|NOSCRIPT|PICTURE|SVG|VIDEO/,
    notEditableTags: /^(AREA|AUDIO|BR|CANVAS|DATALIST|EMBED|HEAD|HR|IFRAME|IMG|INPUT|LINK|MAP|METER|META|OBJECT|OUTPUT|MATH|PROGRESS|PICTURE|SELECT|SCRIPT|SOURCE|SVG|STYLE|TEXTAREA|TITLE|VIDEO)$/,
    textPermittedPhrasingTags: /^(A|ABBR|B|BDI|BDO|BR|CITE|CODE|DATA|DEL|DFN|EM|I|INS|KBD|MARK|OUTPUT|Q|RUBY|SAMP|S|SMALL|SPAN|STRONG|SUB|SUP|TIME|U|VAR|WBR)$/,
    textPermittedFlowTags: /^(UL|OL|H1|H2|H3|H4|H5|H6|P)$/,
    restrictedFlowInsideTags: /^(H1|H2|H3|H4|H5|H6|P)$/,
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#textjavascript
    javascriptMimeTypes: ["", "module", "application/javascript", "application/ecmascript", "application/x-ecmascript ", "application/x-javascript ", "text/javascript", "text/ecmascript", "text/javascript1.0 ", "text/javascript1.1 ", "text/javascript1.2 ", "text/javascript1.3 ", "text/javascript1.4 ", "text/javascript1.5 ", "text/jscript ", "text/livescript ", "text/x-ecmascript ", "text/x-javascript"],
    // https://stackoverflow.com/a/19709846
    URLIsAbsolute: /^(?:[a-z]+:)?\/\//i,
    // https://stackoverflow.com/questions/49974145/how-to-convert-rgba-to-hex-color-code-using-javascript#:~:text=Since%20the%20alpha%20channel%20in,%2Fg%2C%20'').
    // https://css-tricks.com/converting-color-spaces-in-javascript/
    regexOneClassInSelector : /^\.-?[_a-zA-Z-]+[_a-zA-Z0-9-]$/,
    // functions:
    getResourceAbsolutePath : (path)=>{
      return ("/" + tilepieces.frameResourcePath() + "/" + path).replace(/\/\//g,"/")
    },
    elementSum,
    processFile,
    getDimension,
    splitCssValue,
    convertGroupingRuleToSelector,
    notAdmittedTagNameInPosition,
    download,
    createDocumentString,
    unregisterSw,
    paddingURL,
    getRelativePath,
    getDocumentPath,
    getHashes,
    setFixedHTMLInProject,
    dialogNameResolver,
    newJSZip,
    importProjectAsZip
  }
};
tilepieces.cssDefaultProperties = [];
(() => {
  for (var k in document.body.style) {
    if (k == "cssFloat")
      continue;
    if (isNaN(k)) {
      var value = "";
      for (var i = 0; i < k.length; i++) {
        if (k.charAt(i) === k.charAt(i).toUpperCase())
          value += "-" + k.charAt(i).toLowerCase();
        else
          value += k.charAt(i)
      }
      tilepieces.cssDefaultProperties.push(value);
    }
  }
})();
tilepieces.cssDefaultValues = {
  "align-content": [
    "normal",
    "stretch",
    "center",
    "flex-start",
    "flex-end",
    "space-between",
    "space-around",
    "space-evenly",
    "start",
    "end",
    "left",
    "right",
    "baseline",
    "first baseline",
    "last baseline",
    "safe",
    "unsafe",
    "initial",
    "inherit",
    "unset"
  ],
  "align-items": [
    "stretch",
    "center",
    "flex-start",
    "flex-end",
    "baseline",
    "initial",
    "inherit",
    "unset"
  ],
  "align-self": [
    "auto",
    "stretch",
    "center",
    "flex-start",
    "flex-end",
    "baseline",
    "initial",
    "inherit",
    "unset"
  ],
  "all": [
    "initial",
    "inherit",
    "unset"
  ],
  "animation": [
    "{duration} | {timing-function} | {delay} | {iteration-count} | {direction} | {fill-mode} | {play-state} | {name}",
    "300ms ease-in 1s infinite reverse both running ANIMATIONNAME",
    "600ms ease-out 0.8s 4 alternate-reverse forwards ANIMATIONNAME",
    "1.5s ease 0.8s 5 alternate ANIMATIONNAME",
    "1.7s step-start 1s 6 ANIMATIONNAME",
    "1.9s step-end 1s 7 ANIMATIONNAME",
    "2s ease-in-out 1s ANIMATIONNAME",
    "3s linear ANIMATIONNAME",
    "4s ANIMATIONNAME",
    "initial",
    "inherit",
    "unset"
  ],
  "animation-delay": [
    "1s",
    "200ms",
    "initial",
    "inherit",
    "unset"
  ],
  "animation-direction": [
    "normal",
    "reverse",
    "alternate",
    "alternate-reverse",
    "initial",
    "inherit",
    "unset"
  ],
  "animation-duration": [
    "1s",
    "200ms",
    "initial",
    "inherit",
    "unset"
  ],
  "animation-fill-mode": [
    "none",
    "forwards",
    "backwards",
    "both",
    "initial",
    "inherit",
    "unset"
  ],
  "animation-iteration-count": [
    "1",
    "infinite",
    "initial",
    "inherit",
    "unset"
  ],
  "animation-name": [
    "ANIMATIONNAME",
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "animation-play-state": [
    "paused",
    "running",
    "initial",
    "inherit",
    "unset"
  ],
  "animation-timing-function": [
    "linear",
    "ease",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "step-start",
    "step-end",
    "steps(1,end)",
    "cubic-bezier(0,0,0,0)",
    "initial",
    "inherit",
    "unset"
  ],
  "backface-visibility": [
    "visible",
    "hidden",
    "initial",
    "inherit",
    "unset"
  ],
  "background": [
    "url(URL) no-repeat scroll 0 0 transparent",
    "initial",
    "inherit",
    "unset"
  ],
  "background-attachment": [
    "scroll",
    "fixed",
    "local",
    "initial",
    "inherit",
    "unset"
  ],
  "background-blend-mode": [
    "normal",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "saturation",
    "color",
    "luminosity",
    "initial",
    "unset",
    "inherit"
  ],
  "background-clip": [
    "border-box",
    "padding-box",
    "content-box",
    "initial",
    "inherit",
    "unset"
  ],
  "background-color": [
    "rgb(0, 0, 0)",
    "transparent",
    "initial",
    "inherit",
    "unset"
  ],
  "background-image": [
    "url('URL')",
    "none",
    "linear-gradient(45deg, black, transparent)",
    "radial-gradient(black, transparent)",
    "repeating-linear-gradient(45deg, black, transparent 100px)",
    "repeating-radial-gradient(black, transparent 100px)",
    "initial",
    "inherit",
    "unset"
  ],
  "background-origin": [
    "padding-box",
    "border-box",
    "content-box",
    "initial",
    "inherit",
    "unset"
  ],
  "background-position": [
    "left",
    "top",
    "center",
    "bottom",
    "0% 0%",
    "left top",
    "center center",
    "right bottom",
    "1px 1px",
    "initial",
    "inherit",
    "unset"
  ],
  "background-position-x": [
    "left",
    "center",
    "right",
    "0",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "background-position-y": [
    "top",
    "center",
    "bottom",
    "0",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "background-repeat": [
    "repeat",
    "repeat-x",
    "repeat-y",
    "no-repeat",
    "space",
    "round",
    "repeat space",
    "round space",
    "no-repeat round",
    "initial",
    "inherit",
    "unset"
  ],
  "background-size": [
    "auto",
    "100px 100px",
    "100% 100%",
    "cover",
    "contain",
    "initial",
    "inherit",
    "unset"
  ],
  "border": [
    "1px solid rgb(0,0,0)",
    "initial",
    "inherit",
    "unset"
  ],
  "border-bottom": [
    "1px solid rgb(0,0,0)",
    "initial",
    "inherit",
    "unset"
  ],
  "border-bottom-color": [
    "rgb(0,0,0)",
    "transparent",
    "initial",
    "inherit",
    "unset"
  ],
  "border-bottom-left-radius": [
    "100px",
    "100%",
    "initial",
    "inherit",
    "unset"
  ],
  "border-bottom-right-radius": [
    "100px",
    "100%",
    "initial",
    "inherit",
    "unset"
  ],
  "border-bottom-style": [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "initial",
    "inherit",
    "unset"
  ],
  "border-bottom-width": [
    "medium",
    "thin",
    "thick",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "border-collapse": [
    "separate",
    "collapse",
    "initial",
    "inherit",
    "unset"
  ],
  "border-color": [
    "rgb(0,0,0)",
    "transparent",
    "initial",
    "inherit",
    "unset"
  ],
  "border-image": [
    "none 100% 1 0 stretch",
    "initial",
    "inherit",
    "unset"
  ],
  "border-image-outset": [
    "1px",
    "1",
    "initial",
    "inherit",
    "unset"
  ],
  "border-image-repeat": [
    "stretch",
    "repeat",
    "round",
    "space",
    "round stretch",
    "space repeat",
    "initial",
    "inherit",
    "unset"
  ],
  "border-image-slice": [
    "1",
    "2%",
    "fill",
    "initial",
    "inherit",
    "unset"
  ],
  "border-image-source": [
    "none",
    "url(URL)",
    "initial",
    "inherit",
    "unset"
  ],
  "border-image-width": [
    "1px",
    "1",
    "1%",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "border-left": [
    "1px solid rgb(0,0,0)",
    "initial",
    "inherit",
    "unset"
  ],
  "border-left-color": [
    "rgb(0,0,0)",
    "transparent",
    "initial",
    "inherit",
    "unset"
  ],
  "border-left-style": [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "initial",
    "inherit",
    "unset"
  ],
  "border-left-width": [
    "medium",
    "thin",
    "thick",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "border-radius": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "border-right": [
    "1px solid rgb(0,0,0)",
    "initial",
    "inherit",
    "unset"
  ],
  "border-right-color": [
    "rgb(0,0,0)",
    "transparent",
    "initial",
    "inherit",
    "unset"
  ],
  "border-right-style": [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "initial",
    "inherit",
    "unset"
  ],
  "border-right-width": [
    "medium",
    "thin",
    "thick",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "border-spacing": [
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "border-style": [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "initial",
    "inherit",
    "unset"
  ],
  "border-top": [
    "1px solid rgb(0,0,0)",
    "initial",
    "inherit",
    "unset"
  ],
  "border-top-color": [
    "rgb(0,0,0)",
    "transparent",
    "initial",
    "inherit",
    "unset"
  ],
  "border-top-left-radius": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "border-top-right-radius": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "border-top-style": [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "initial",
    "inherit",
    "unset"
  ],
  "border-top-width": [
    "medium",
    "thin",
    "thick",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "border-width": [
    "medium",
    "thin",
    "thick",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "bottom": [
    "auto",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "box-decoration-break": [
    "slice",
    "clone",
    "initial",
    "inherit",
    "unset"
  ],
  "box-shadow": [
    "none",
    "10px 20px 30px blue inset",
    "initial",
    "inherit",
    "unset"
  ],
  "box-sizing": [
    "content-box",
    "border-box",
    "initial",
    "inherit",
    "unset"
  ],
  "caption-side": [
    "top",
    "bottom",
    "initial",
    "inherit",
    "unset"
  ],
  "caret-color": [
    "auto",
    "rgb(0,0,0)",
    "initial",
    "unset",
    "inherit"
  ],
  "clear": [
    "none",
    "left",
    "right",
    "both",
    "initial",
    "inherit",
    "unset"
  ],
  "clip": [
    "auto",
    "shape",
    "initial",
    "inherit",
    "unset"
  ],
  "clip-path": [
    "circle(50%)",
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "color": [
    "rgb(0,0,0)",
    "initial",
    "inherit",
    "unset"
  ],
  "column-count": [
    "1",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "column-fill": [
    "balance",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "column-gap": [
    "1px",
    "normal",
    "initial",
    "inherit",
    "unset"
  ],
  "column-rule": [
    "column-rule-width",
    "column-rule-style",
    "column-rule-color",
    "initial",
    "inherit",
    "unset"
  ],
  "column-rule-color": [
    "color",
    "initial",
    "inherit",
    "unset"
  ],
  "column-rule-style": [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "initial",
    "inherit",
    "unset"
  ],
  "column-rule-width": [
    "medium",
    "thin",
    "thick",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "column-span": [
    "none",
    "all",
    "initial",
    "inherit",
    "unset"
  ],
  "column-width": [
    "auto",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "columns": [
    "auto",
    "column-width",
    "column-count",
    "initial",
    "inherit",
    "unset"
  ],
  "content": [
    "normal",
    "none",
    "counter",
    "attr(attribute)",
    "string",
    "open-quote",
    "close-quote",
    "no-open-quote",
    "no-close-quote",
    "url(url)",
    "initial",
    "inherit",
    "unset"
  ],
  "counter-increment": [
    "none",
    "idnumber",
    "initial",
    "inherit",
    "unset"
  ],
  "counter-reset": [
    "none",
    "idnumber",
    "initial",
    "inherit",
    "unset"
  ],
  "cursor": [
    "alias",
    "all-scroll",
    "auto",
    "cell",
    "context-menu",
    "col-resize",
    "copy",
    "crosshair",
    "default",
    "e-resize",
    "ew-resize",
    "grab",
    "grabbing",
    "help",
    "move",
    "n-resize",
    "ne-resize",
    "nesw-resize",
    "ns-resize",
    "nw-resize",
    "nwse-resize",
    "no-drop",
    "none",
    "not-allowed",
    "pointer",
    "progress",
    "row-resize",
    "s-resize",
    "se-resize",
    "sw-resize",
    "text",
    "URL",
    "vertical-text",
    "w-resize",
    "wait",
    "zoom-in",
    "zoom-out",
    "initial",
    "inherit",
    "unset"
  ],
  "direction": [
    "ltr",
    "rtl",
    "initial",
    "inherit",
    "unset"
  ],
  "display": [
    "inline",
    "block",
    "contents",
    "flex",
    "grid",
    "inline-block",
    "inline-flex",
    "inline-grid",
    "inline-table",
    "list-item",
    "run-in",
    "table",
    "table-caption",
    "table-column-group",
    "table-header-group",
    "table-footer-group",
    "table-row-group",
    "table-cell",
    "table-column",
    "table-row",
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "empty-cells": [
    "show",
    "hide",
    "initial",
    "inherit",
    "unset"
  ],
  "filter": [
    "none",
    "blur(0px)",
    "brightness(0%)",
    "contrast(0%)",
    "drop-shadow(0 0 0 0 rgba(0,0,0,0))",
    "grayscale(0%)",
    "hue-rotate(0deg)",
    "invert(0%)",
    "opacity(0%)",
    "saturate(0%)",
    "sepia(0%)",
    "url(URL)",
    "initial",
    "inherit",
    "unset"
  ],
  "flex": [
    "0 1 auto",
    "auto",
    "initial",
    "none",
    "inherit",
    "unset"
  ],
  "flex-basis": [
    "1",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "flex-direction": [
    "row",
    "row-reverse",
    "column",
    "column-reverse",
    "initial",
    "inherit",
    "unset"
  ],
  "flex-flow": [
    "flex-direction",
    "flex-wrap",
    "initial",
    "inherit",
    "unset"
  ],
  "flex-grow": [
    "1",
    "initial",
    "inherit",
    "unset"
  ],
  "flex-shrink": [
    "1",
    "initial",
    "inherit",
    "unset"
  ],
  "flex-wrap": [
    "nowrap",
    "wrap",
    "wrap-reverse",
    "initial",
    "inherit",
    "unset"
  ],
  "float": [
    "none",
    "left",
    "right",
    "initial",
    "inherit",
    "unset"
  ],
  "font": [
    "normal normal 400 1em/normal Arial, Helvetica, sans-serif",
    "caption",
    "icon",
    "menu",
    "message-box",
    "small-caption",
    "status-bar",
    "initial",
    "inherit",
    "unset"
  ],
  "font-family": [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "initial",
    "inherit",
    "unset"
  ],
  "font-kerning": [
    "auto",
    "normal",
    "none",
    "initial",
    "unset",
    "inherit"
  ],
  "font-size": [
    "medium",
    "xx-small",
    "x-small",
    "small",
    "large",
    "x-large",
    "xx-large",
    "smaller",
    "larger",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "font-size-adjust": [
    "1",
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "font-stretch": [
    "ultra-condensed",
    "extra-condensed",
    "condensed",
    "semi-condensed",
    "normal",
    "semi-expanded",
    "expanded",
    "extra-expanded",
    "ultra-expanded",
    "initial",
    "inherit",
    "unset"
  ],
  "font-style": [
    "normal",
    "italic",
    "oblique",
    "initial",
    "inherit",
    "unset"
  ],
  "font-variant": [
    "normal",
    "small-caps",
    "initial",
    "inherit",
    "unset"
  ],
  "font-weight": [
    "normal",
    "bold",
    "bolder",
    "lighter",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "initial",
    "inherit",
    "unset"
  ],
  "grid": [
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "grid-area": [
    "auto / auto / auto / auto",
    "auto",
    "itemname",
    "initial",
    "inherit",
    "unset"
  ],
  "grid-auto-columns": [
    "auto",
    "fit-content()",
    "max-content",
    "min-content",
    "minmax(min.max)",
    "1px",
    "1%",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-auto-flow": [
    "row",
    "column",
    "dense",
    "rowdense",
    "columndense",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-auto-rows": [
    "auto",
    "max-content",
    "min-content",
    "1px",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-column": [
    "grid-column-start",
    "grid-column-end",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-column-end": [
    "auto",
    "spann",
    "column-line",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-column-gap": [
    "1px",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-column-start": [
    "auto",
    "spann",
    "column-line",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-gap": [
    "grid-row-gap",
    "grid-column-gap",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-row": [
    "grid-row-start",
    "grid-row-end",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-row-end": [
    "auto",
    "spann",
    "column-line",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-row-gap": [
    "1px",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-row-start": [
    "auto",
    "row-line",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-template": [
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "grid-template-areas": [
    "none",
    "itemnames",
    "initial",
    "unset",
    "inherit"
  ],
  "grid-template-columns": [
    "none",
    "auto",
    "max-content",
    "min-content",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "grid-template-rows": [
    "none",
    "auto",
    "max-content",
    "min-content",
    "1px",
    "initial",
    "unset",
    "inherit"
  ],
  "hanging-punctuation": [
    "none",
    "first",
    "last",
    "allow-end",
    "force-end",
    "initial",
    "inherit",
    "unset"
  ],
  "height": [
    "auto",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "hyphens": [
    "none",
    "manual",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "isolation": [
    "auto",
    "isolate",
    "initial",
    "inherit",
    "unset"
  ],
  "justify-content": [
    "flex-start",
    "flex-end",
    "center",
    "space-between",
    "space-around",
    "initial",
    "inherit",
    "unset"
  ],
  "left": [
    "auto",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "letter-spacing": [
    "normal",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "line-height": [
    "normal",
    "1",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "list-style": [
    "square",
    "georgian",
    "disc",
    "decimal",
    "'-'",
    "url('URL')",
    "initial",
    "inherit",
    "unset"
  ],
  "list-style-image": [
    "none",
    "url('URL')",
    "initial",
    "inherit",
    "unset"
  ],
  "list-style-position": [
    "inside",
    "outside",
    "initial",
    "inherit",
    "unset"
  ],
  "list-style-type": [
    "disc",
    "armenian",
    "circle",
    "cjk-ideographic",
    "decimal",
    "decimal-leading-zero",
    "georgian",
    "hebrew",
    "hiragana",
    "hiragana-iroha",
    "katakana",
    "katakana-iroha",
    "lower-alpha",
    "lower-greek",
    "lower-latin",
    "lower-roman",
    "none",
    "square",
    "upper-alpha",
    "upper-greek",
    "upper-latin",
    "upper-roman",
    "'\\1F44D'",
    "'\\2713'",
    "'\\2714'",
    "initial",
    "inherit",
    "unset"
  ],
  "margin": [
    "1px",
    "1%",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "margin-bottom": [
    "1px",
    "1%",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "margin-left": [
    "1px",
    "1%",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "margin-right": [
    "1px",
    "1%",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "margin-top": [
    "1px",
    "1%",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "max-height": [
    "none",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "max-width": [
    "none",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "min-height": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "min-width": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "mix-blend-mode": [
    "normal",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity",
    "initial",
    "unset",
    "inherit"
  ],
  "object-fit": [
    "fill",
    "contain",
    "cover",
    "none",
    "scale-down",
    "initial",
    "inherit",
    "unset"
  ],
  "object-position": [
    "position",
    "initial",
    "inherit",
    "unset"
  ],
  "opacity": [
    "1",
    "initial",
    "inherit",
    "unset"
  ],
  "order": [
    "1",
    "initial",
    "inherit",
    "unset"
  ],
  "outline": [
    "outline-width",
    "outline-style",
    "outline-color",
    "initial",
    "inherit",
    "unset"
  ],
  "outline-color": [
    "invert",
    "rgb(0,0,0)",
    "initial",
    "inherit",
    "unset"
  ],
  "outline-offset": [
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "outline-style": [
    "none",
    "hidden",
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "initial",
    "inherit",
    "unset"
  ],
  "outline-width": [
    "medium",
    "thin",
    "thick",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "overflow": [
    "visible",
    "hidden",
    "scroll",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "overflow-x": [
    "visible",
    "hidden",
    "scroll",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "overflow-y": [
    "visible",
    "hidden",
    "scroll",
    "auto",
    "initial",
    "inherit",
    "unset"
  ],
  "padding": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "padding-bottom": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "padding-left": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "padding-right": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "padding-top": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "page-break-after": [
    "auto",
    "always",
    "avoid",
    "left",
    "right",
    "initial",
    "inherit",
    "unset"
  ],
  "page-break-before": [
    "auto",
    "always",
    "avoid",
    "left",
    "right",
    "initial",
    "inherit",
    "unset"
  ],
  "page-break-inside": [
    "auto",
    "avoid",
    "initial",
    "inherit",
    "unset"
  ],
  "perspective": [
    "1px",
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "perspective-origin": [
    "0 0",
    "initial",
    "inherit",
    "unset"
  ],
  "pointer-events": [
    "auto",
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "position": [
    "static",
    "absolute",
    "fixed",
    "relative",
    "sticky",
    "initial",
    "inherit",
    "unset"
  ],
  "quotes": [
    "none",
    "string",
    "initial",
    "inherit",
    "unset"
  ],
  "resize": [
    "none",
    "both",
    "horizontal",
    "vertical",
    "initial",
    "inherit",
    "unset"
  ],
  "right": [
    "auto",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "scroll-behavior": [
    "auto",
    "smooth",
    "initial",
    "inherit",
    "unset"
  ],
  "tab-size": [
    "1",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "table-layout": [
    "auto",
    "fixed",
    "initial",
    "inherit",
    "unset"
  ],
  "text-align": [
    "left",
    "right",
    "center",
    "start",
    "end",
    "justify",
    "match-parent",
    "initial",
    "inherit",
    "unset"
  ],
  "text-align-last": [
    "auto",
    "left",
    "right",
    "center",
    "justify",
    "start",
    "end",
    "initial",
    "inherit",
    "unset"
  ],
  "text-decoration": [
    "none",
    "underline",
    "overline",
    "line-through",
    "blink",
    "underline dotted red",
    "underline overline",
    "overline underline line-through",
    "initial",
    "inherit",
    "unset"
  ],
  "text-decoration-color": [
    "red",
    "initial",
    "inherit",
    "unset"
  ],
  "text-decoration-line": [
    "none",
    "underline",
    "overline",
    "line-through",
    "initial",
    "inherit",
    "unset"
  ],
  "text-decoration-style": [
    "solid",
    "double",
    "dotted",
    "dashed",
    "wavy",
    "initial",
    "inherit",
    "unset"
  ],
  "text-indent": [
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "text-justify": [
    "auto",
    "inter-word",
    "inter-character",
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "text-overflow": [
    "clip",
    "ellipsis",
    "string",
    "initial",
    "inherit",
    "unset"
  ],
  "text-shadow": [
    "h-shadow",
    "v-shadow",
    "blur-radius",
    "color",
    "none",
    "initial",
    "inherit",
    "unset"
  ],
  "text-transform": [
    "none",
    "capitalize",
    "uppercase",
    "lowercase",
    "initial",
    "inherit",
    "unset"
  ],
  "top": [
    "auto",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "transform": [
    "none",
    "matrix(0,0,0,0,0,0)",
    "matrix3d(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)",
    "translate(0,0)",
    "translate3d(0,0,0)",
    "translateX(0)",
    "translateY(0)",
    "translateZ(0)",
    "scale(0,0)",
    "scale3d(0,0,0)",
    "scaleX(0)",
    "scaleY(0)",
    "scaleZ(0)",
    "rotate(0deg)",
    "rotate3d(0,0,0,0deg)",
    "rotateX(0deg)",
    "rotateY(0deg)",
    "rotateZ(0deg)",
    "skew(0deg,0deg)",
    "skewX(0deg)",
    "skewY(0deg)",
    "perspective(0)",
    "initial",
    "inherit",
    "unset"
  ],
  "transform-origin": [
    "left",
    "center",
    "right",
    "top",
    "bottom",
    "1px",
    "left 2px",
    "right bottom -3px",
    "initial",
    "inherit",
    "unset"
  ],
  "transform-style": [
    "flat",
    "preserve-3d",
    "initial",
    "inherit",
    "unset"
  ],
  "transition": [
    "{name} | {duration}",
    "margin-right 4s",
    "{name} | {duration} | {delay}",
    "margin-right 4s 1",
    "{name} | {duration} | {timing function}",
    "margin-right 4s ease-in-out",
    "{name} | {duration} | {timing function} | {delay}",
    "margin-right 4s ease-in-out 1s",
    "margin-right 4s, color 1s",
    "initial",
    "inherit",
    "unset"
  ],
  "transition-delay": [
    "1s",
    "200ms",
    "initial",
    "inherit",
    "unset"
  ],
  "transition-duration": [
    "1s",
    "200ms",
    "initial",
    "inherit",
    "unset"
  ],
  "transition-property": [
    "none",
    "all",
    "property",
    "initial",
    "inherit",
    "unset"
  ],
  "transition-timing-function": [
    "ease",
    "linear",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "step-start",
    "step-end",
    "steps(1,end)",
    "cubic-bezier(0,0,0,0)",
    "initial",
    "inherit",
    "unset"
  ],
  "unicode-bidi": [
    "normal",
    "embed",
    "bidi-override",
    "isolate",
    "isolate-override",
    "plaintext",
    "initial",
    "inherit",
    "unset"
  ],
  "user-select": [
    "auto",
    "none",
    "text",
    "all",
    "initial",
    "unset",
    "inherit"
  ],
  "vertical-align": [
    "baseline",
    "1px",
    "1%",
    "sub",
    "super",
    "top",
    "text-top",
    "middle",
    "bottom",
    "text-bottom",
    "initial",
    "inherit",
    "unset"
  ],
  "visibility": [
    "visible",
    "hidden",
    "collapse",
    "initial",
    "inherit",
    "unset"
  ],
  "white-space": [
    "normal",
    "nowrap",
    "pre",
    "pre-line",
    "pre-wrap",
    "initial",
    "inherit",
    "unset"
  ],
  "width": [
    "auto",
    "1px",
    "1%",
    "initial",
    "inherit",
    "unset"
  ],
  "word-break": [
    "normal",
    "break-all",
    "keep-all",
    "break-word",
    "initial",
    "inherit",
    "unset"
  ],
  "word-spacing": [
    "normal",
    "1px",
    "initial",
    "inherit",
    "unset"
  ],
  "word-wrap": [
    "normal",
    "break-word",
    "initial",
    "inherit",
    "unset"
  ],
  "writing-mode": [
    "horizontal-tb",
    "vertical-rl",
    "vertical-lr",
    "initial",
    "unset",
    "inherit"
  ],
  "z-index": [
    "auto",
    "1",
    "initial",
    "inherit",
    "unset"
  ]
}
/*
window.addEventListener("tilepieces-core-history-change", e => {
  if (tilepieces.elementSelected && tilepieces.core.currentDocument.documentElement.contains(tilepieces.elementSelected))
    tilepieces.core.deselectElement();
  if (tilepieces.multiselected)
    tilepieces.destroyMultiselection();
  if (tilepieces.lastEditable) {
    tilepieces.lastEditable.destroy();
    tilepieces.lastEditable = null;
  }
  //tilepieces.core.removeSelection();
});*/
window.addEventListener("tilepieces-core-history-change", e => {
  if(tilepieces.elementSelected)
    tilepieces.core.selectElement(tilepieces.elementSelected);
});
TilepiecesCore.prototype.redo = async function (dontSave) {
  var $self = this;
  var history = $self.history;
  if (!history.entries.length
    || history.pointer == history.entries.length)
    return;
  var pointer = history.pointer;
  var historyEntry = history.entries[pointer];
  try {
    if (historyEntry.type == "htmltreematch-entry")
      $self.htmlMatch.redo();
    else
      await historyMethods[historyEntry.method].redo(historyEntry, $self);
    history.pointer++;
    !dontSave && await tilepieces.updateFile(
      historyEntry.__historyFileRecord.newRecord.path,
      historyEntry.__historyFileRecord.newRecord.text);
    window.dispatchEvent(new Event("tilepieces-core-history-set"));
    window.dispatchEvent(new Event("tilepieces-core-history-change"));
  } catch (e) {
    console.error("[tilepieces-core history]", e);
    $self.history.entries = $self.history.entries.slice(0, pointer);
    $self.history.pointer = 0;
    window.dispatchEvent(new Event("tilepieces-core-history-error"));
    window.dispatchEvent(new Event("tilepieces-core-history-set"));
    dialog.close();
    alertDialog.open("history error",true);
  }
};
TilepiecesCore.prototype.setHistory = async function (historyObject) {
  var $self = this;
  var history = $self.history;
  var pointer = history.pointer;
  var entries = history.entries;
  if (pointer != entries.length) {
    var lastHtmlTreeMatchEntry;
    for (var i = history.entries.length - 1; i >= 0; i--) {
      if (history.entries[i].type == "htmltreematch-entry") {
        lastHtmlTreeMatchEntry = history.entries[i];
        break;
      }
    }
    if (lastHtmlTreeMatchEntry)
      $self.htmlMatch.history.entries = entries.slice(0, lastHtmlTreeMatchEntry.pointer + 1);
    history.entries = entries.slice(0, pointer);
  }
  history.pointer = history.entries.push(historyObject);
  var newRecord = historyObject.__historyFileRecord.newRecord;
  try {
    await tilepieces.updateFile(newRecord.path, newRecord.text);
  }
  catch(e){
    alertDialog.open("can't save the path "+ newRecord.path,true);
  }
  window.dispatchEvent(new Event("tilepieces-core-history-set"));
};
TilepiecesCore.prototype.undo = async function (dontSave) {
  var $self = this;
  var history = $self.history;
  if (!history.entries.length || history.pointer == 0)
    return;
  var pointer;
  history.pointer--;
  pointer = history.pointer;
  var historyEntry = history.entries[pointer];
  try {
    if (historyEntry.type == "htmltreematch-entry")
      $self.htmlMatch.undo();
    else historyMethods[historyEntry.method].undo(historyEntry);
    !dontSave && await tilepieces.updateFile(
      historyEntry.__historyFileRecord.oldRecord.path,
      historyEntry.__historyFileRecord.oldRecord.text);
    window.dispatchEvent(new Event("tilepieces-core-history-set"));
    window.dispatchEvent(new Event("tilepieces-core-history-change"));
  } catch (e) {
    console.error("[tilepieces-core history]", e);
    console.error("[history]", $self.history);
    $self.history.entries = [];//$self.history.entries.slice(pointer + 1);
    history.stylesheets.splice(1)
    history.documents.splice(1)
    $self.history.pointer = 0;
    window.dispatchEvent(new Event("tilepieces-core-history-error"));
    window.dispatchEvent(new Event("tilepieces-core-history-set"));
    dialog.close();
    alertDialog.open("history error",true);
  }
};
TilepiecesCore.prototype.init = async function (doc, HTMLText,skipMatchAll) {
  var $self = this;
  $self.currentDocument = doc;
  $self.currentWindow = doc.defaultView;
  $self.htmlMatch = HTMLTreeMatch(HTMLText, doc,skipMatchAll);
  $self.styles = await cssMapper(doc, tilepieces.idGenerator, tilepieces.classGenerator);
  var currentStyle = [...doc.querySelectorAll("[data-tilepieces-current-stylesheet]")].pop();
  var currentStyleIsAccesible;
  try {
    currentStyleIsAccesible = currentStyle.sheet.cssRules
  } catch (e) {
  }
  if (currentStyleIsAccesible) {
    var found = $self.htmlMatch.find(currentStyle);
    if (found) {
      $self.currentStyleSheet = currentStyle.sheet;
      $self.matchCurrentStyleSheetNode = found.match;
    }
  }
  $self.history.originalDocument = HTMLText;
  $self.fontAlreadyDeclared = [];
  window.dispatchEvent(new CustomEvent("cssMapper-changed", {detail: $self}));
  $self.idIndex = $self.styles.idIndex;
  $self.classIndex = $self.styles.classIndex;
  findGeneratorIndexes($self);
  $self.htmlMatch.on("history-entry", e => {
    var path = tilepieces.currentPage.path;
    var oldRecordFind = $self.history.entries.slice(0).reverse()
      .find(v=>v.type=="htmltreematch-entry" ||
        v.method?.match(/createCurrentStyleSheet|setCurrentStyleSheet/));
    var oldRecord = oldRecordFind ? oldRecordFind.__historyFileRecord.newRecord : {path,text:$self.history.originalDocument};
    var newDoc = $self.createDocumentText($self.htmlMatch.source);
    var newRecord = {path, text: newDoc};
    $self.setHistory({type: "htmltreematch-entry", pointer: e.pointer, ho: e.historyObject,
      __historyFileRecord : {oldRecord, newRecord}});
  });
  $self.observer = $self.observe(doc);
  $self.cachedProperties = [];
  if (tilepieces.multiselected)
    tilepieces.multiselections = [];
  if (tilepieces.elementSelected)
    tilepieces.elementSelected = null;
  return $self;
};
let stopEditing = document.createElement("div");
stopEditing.id = "stop-editing";
var linearGradient = "linear-gradient(rgba(0, 0, 0, 0.09) 0%, 5%, rgba(0, 0, 0, 0) 50%, 97%, rgba(0, 0, 0, 0.09) 100%)";
stopEditing.style.cssText = "position:fixed;width:100%;height:100%;z-index:44;top:0;left:0;" + linearGradient;
window.addEventListener("lock-down", () => {
  document.body.appendChild(stopEditing);
  tilepieces.panels.forEach(d => {
    if (!d)// colorpicker
      return;
    var wO = d.windowOpen;
    var wODoc = wO?.document;
    if (wO && !wODoc.getElementById(stopEditing.id)) {
      wODoc.body.appendChild(stopEditing.cloneNode());
    }
  })
});
window.addEventListener("release", () => {
  stopEditing.remove();
  tilepieces.panels.forEach(d => {
    if (!d) // colorpicker
      return;
    var wO = d.windowOpen;
    if (wO)
      wO.document.getElementById(stopEditing.id).remove();
  })
});
let regexNumbers = /[+-]?\d+(?:\.\d+)?/; // https://codereview.stackexchange.com/questions/115885/extract-numbers-from-a-string-javascript
let historyMethods = {};

function TilepiecesCore() {
  var $self = this;
  $self.currentDocument = null;
  $self.styles = [];
  $self.htmlMatch = null;
  $self.history = {
    entries: [],
    pointer: 0,
    documents: [],
    stylesheets: []
  };
  $self.cssMatcher = cssMatcher;
  $self.stylesChangeListeners = [];
  $self.unitConverter = unitConverter;
  $self.getUnitProperties = getUnitProperties;
  $self.styleChanges = {
    listeners: [],
    onChange: (cb, once) => $self.styleChanges.listeners.push({cb, once})
  };
  $self.destroy = () => {
    $self.observer && $self.observer.disconnect();
    if(tilepieces.multiselected){
      tilepieces.destroyMultiselection(true);
    }
    drawSelection && $self.removeSelection();
    if (tilepieces) {
      tilepieces.elementSelected = null;
      tilepieces.core = null;
      tilepieces.fileSelected = {};
      tilepieces.currentPage = null;
    }
  };
  return this;
}

window.tilepiecesCore = function (o) {
  return new TilepiecesCore(o);
}
tilepieces.createSelectionClone = function (el) {
  if (tilepieces.multiselections.find(v => v.el == el))
    return;
  var highlight = tilepieces.editElements.selection.cloneNode(true);
  highlight.classList.add("highlight-selection-clone");
  highlight.style.opacity = "0.45";
  highlight.style.transform = "translate(-9999px,-9999px)";
  document.body.appendChild(highlight);
  tilepieces.multiselections.push({el, highlight});
};
tilepieces.destroyMultiselection = function (noemit) {
  tilepieces.multiselected = null;
  tilepieces.multiselections.forEach((v, i) => {
    var el = tilepieces.multiselections[i];
    if (el.el == tilepieces.elementSelected)
        return;
    var highlight = el.highlight;
    highlight.remove();
    !noemit && window.dispatchEvent(new CustomEvent("deselect-multielement", {detail: el.el}));
  });
  tilepieces.multiselections = [];
  !noemit && window.dispatchEvent(new Event("multiselection-canceled"))
}
tilepieces.enableMultiselection = function () {
  if (tilepieces.multiselected)
    return;
  tilepieces.multiselected = true;
  if (tilepieces.elementSelected && (
    !tilepieces.selectorObj.match || tilepieces.elementSelected.tagName?.match(/HTML|HEAD|BODY/)))
    tilepieces.core.deselectElement();
  else if (tilepieces.elementSelected)
    tilepieces.createSelectionClone(tilepieces.elementSelected);
  window.dispatchEvent(new Event("multiselection-enabled"));
}
tilepieces.removeItemSelected = function (i) {
  if (typeof i === "undefined")
    i = tilepieces.multiselections.length - 1;
  var el = tilepieces.multiselections[i];
  var highlight = el.highlight;
  highlight.remove();
  tilepieces.multiselections.splice(i, 1);
  window.dispatchEvent(new CustomEvent("deselect-multielement", {detail: el.el}));
  if (el.el == tilepieces.elementSelected) {
    tilepieces.core.deselectElement();
    var newIndex = tilepieces.multiselections.length - 1;
    newIndex > -1 && tilepieces.core.selectElement(tilepieces.multiselections[newIndex].el);
  }
}
TilepiecesCore.prototype.observe = function (targetNode) {
  var $self = this;
  var observerOptions = {
    childList: true,
    attributes: true,
    subtree: true,
    characterData: true
  };

  function callback(mutationList, observer) {
    observeStyleSheets(mutationList, $self);
    window.dispatchEvent(new CustomEvent("tilepieces-mutation-event", {
      detail: {
        mutationList
      }
    }));
    if(tilepieces.multiselected) {
      tilepieces.multiselections.slice(0).forEach((v, i) => {
        if (!tilepieces.core.currentDocument.documentElement.contains(v.el))
          tilepieces.removeItemSelected(i)
      })
    }
    var isElementSelectedRemoved = tilepieces.elementSelected &&
      !tilepieces.core.currentDocument.documentElement.contains(tilepieces.elementSelected);
    isElementSelectedRemoved && tilepieces.core.deselectElement();
  }

  var observer = new MutationObserver(callback);
  observer.observe(targetNode, observerOptions);
  return observer;
}
let globalPendingStyle;

function updateStyles($self) {
  console.log("[is updating styles...]");
  console.log("[globalPendingStyle] ", globalPendingStyle);
  var currentStyleSheet = $self.currentStyleSheet;
  var currentStyleSheetSelector = "[" + tilepieces.currentStyleSheetAttribute + "]";
  if (currentStyleSheet &&
    !$self.currentDocument.documentElement.contains(currentStyleSheet.ownerNode)) {
    var match = $self.htmlMatch.match($self.matchCurrentStyleSheetNode, false, false, true);
    if (match) {
      $self.currentStyleSheet = match.sheet;
    } else {
      var possiblesCurrentStyleSheets = [...$self.currentDocument.querySelectorAll(currentStyleSheetSelector)];
      if (possiblesCurrentStyleSheets.length) {
        var last = possiblesCurrentStyleSheets.pop();
        $self.matchCurrentStyleSheetNode =
          $self.htmlMatch.match(last);
        if ($self.matchCurrentStyleSheetNode)
          $self.currentStyleSheet = last.sheet;
      } else {
        $self.currentStyleSheet = null;
        $self.matchCurrentStyleSheetNode = null;
      }
    }
  }
  $self.runcssMapper();
  if (globalPendingStyle)
    globalPendingStyle = false;
}

function styleObs(mutation, $self) {
  var hasStylesChanged, hasStylesOnAsync;
  if (mutation.type == "attributes" &&
    (mutation.attributeName.toLowerCase() == "href" ||
      mutation.attributeName.toLowerCase() == "disabled") &&
    mutation.target.tagName == "LINK" &&
    mutation.target.rel.toLowerCase() == "stylesheet") {
    if (mutation.attributeName.toLowerCase() == "href")
      $self.fetchingStylesheet(mutation.target.getAttribute("href")).then(() => {
        // at this point, sheet should be loaded. However, we do longPolling, just in case.
        longPollingStyleSheet(mutation.target, () => updateStyles($self))
      }, err => {
        globalPendingStyle && updateStyles($self);
      });
    else
      hasStylesChanged = true;
  }
  if (mutation.type == "childList" &&
    mutation.target.tagName == "STYLE")
    hasStylesChanged = true;
  mutation.addedNodes.forEach(v => {
    if (v.tagName == "STYLE" && v.sheet)
      hasStylesChanged = true;
    if (v.tagName == "LINK" && v.rel.toLowerCase() == "stylesheet") {
      if (!v.sheet) {
        hasStylesOnAsync = true;
        $self.fetchingStylesheet(v.getAttribute("href")).then(() => {
          // at this point, sheet should be loaded. However, we do longPolling, just in case.
          longPollingStyleSheet(v, () => updateStyles($self))
        }, err => {
          globalPendingStyle && updateStyles($self);
        });
      } else hasStylesChanged = true;
    }
  });
  mutation.removedNodes.forEach(v => {
    if ((v.tagName == "STYLE") ||
      (v.tagName == "LINK" && v.rel.toLowerCase() == "stylesheet")
    ) {
      hasStylesChanged = true;
    }
  });
  return {hasStylesChanged, hasStylesOnAsync};
}

function observeStyleSheets(mutationList, $self) {
  var hasStylesChanged, hasStylesOnAsync;
  mutationList.forEach(mutation => {
    var res = styleObs(mutation, $self);
    hasStylesChanged = res.hasStylesChanged || hasStylesChanged;
    hasStylesOnAsync = res.hasStylesOnAsync || hasStylesOnAsync;
  });
  hasStylesChanged && !hasStylesOnAsync && updateStyles($self);//$self.runcssMapper();
  if (hasStylesChanged && hasStylesOnAsync)
    globalPendingStyle = true;
}
TilepiecesCore.prototype.runcssMapper = async function () {
  var $self = this;
  var styles = await cssMapper($self.currentDocument, tilepieces.idGenerator, tilepieces.classGenerator);
  $self.styles = styles;
  //findGeneratorIndexes($self);
  $self.styleChanges.listeners = $self.styleChanges.listeners.filter(v => {
    v.cb();
    return !v.once;
  });
  window.dispatchEvent(new CustomEvent("cssMapper-changed", {detail: $self}));
  return styles;
}
TilepiecesCore.prototype.deselectElement = function () {
  var obj = {target: tilepieces.elementSelected};
  tilepieces.elementSelected = null;
  tilepieces.cssSelector = null;
  tilepieces.cssSelectorObj = null;
  tilepieces.selectorObj = null;
  tilepieces.editElements.selection.style.transform = "translate(-9999px,-9999px)";
  window.dispatchEvent(
    new CustomEvent("deselect-element", {detail: obj}));
};
function drawBox(computed, bound, x, y) {
  var marginDiv = tilepieces.editElements.marginDiv;
  var borderDiv = tilepieces.editElements.borderDiv;
  var paddingDiv = tilepieces.editElements.paddingDiv;
  if (tilepieces.editElements.margin) {
    var marginTop = getPropertyComputed(computed, "margin-top");
    var marginLeft = getPropertyComputed(computed, "margin-left");
    var marginRight = getPropertyComputed(computed, "margin-right");
    var marginBottom = getPropertyComputed(computed, "margin-bottom");
    marginDiv.style.width = bound.width + "px";
    marginDiv.style.height = bound.height + "px";
    marginDiv.style.borderTopWidth = marginTop + "px";
    marginDiv.style.borderLeftWidth = marginLeft + "px";
    marginDiv.style.borderRightWidth = marginRight + "px";
    marginDiv.style.borderBottomWidth = marginBottom + "px";
    var m = `translate(${x - marginLeft}px,${y - marginTop}px)`;
    marginDiv.style.transform = m;
  } else marginDiv.removeAttribute("style");
  var borderTop, borderLeft, borderRight, borderBottom;
  if (tilepieces.editElements.border || tilepieces.editElements.padding) {
    borderTop = getPropertyComputed(computed, "border-top-width");
    borderLeft = getPropertyComputed(computed, "border-left-width");
    borderRight = getPropertyComputed(computed, "border-right-width");
    borderBottom = getPropertyComputed(computed, "border-bottom-width");
  }
  if (tilepieces.editElements.border) {
    borderDiv.style.width = (bound.width - borderRight - borderLeft) + "px";
    borderDiv.style.height = (bound.height - borderBottom - borderTop) + "px";
    borderDiv.style.borderTopWidth = borderTop + "px";
    borderDiv.style.borderLeftWidth = borderLeft + "px";
    borderDiv.style.borderRightWidth = borderRight + "px";
    borderDiv.style.borderBottomWidth = borderBottom + "px";
    borderDiv.style.transform = `translate(${x}px,${y}px)`;
  } else borderDiv.removeAttribute("style");
  if (tilepieces.editElements.padding) {
    var paddingTop = getPropertyComputed(computed, "padding-top");
    var paddingLeft = getPropertyComputed(computed, "padding-left");
    var paddingRight = getPropertyComputed(computed, "padding-right");
    var paddingBottom = getPropertyComputed(computed, "padding-bottom");
    paddingDiv.style.width = (bound.width - paddingLeft - paddingRight) + "px";
    paddingDiv.style.height = (bound.height - paddingTop - paddingBottom) + "px";
    paddingDiv.style.borderTopWidth = paddingTop + "px";
    paddingDiv.style.borderLeftWidth = paddingLeft + "px";
    paddingDiv.style.borderRightWidth = paddingRight + "px";
    paddingDiv.style.borderBottomWidth = paddingBottom + "px";
    paddingDiv.style.transform = `translate(${x}px,${y}px)`;
  } else paddingDiv.removeAttribute("style");
}
function drawSel(t) {
  if(tilepieces.multiselected && tilepieces.editMode == "selection" && !tilepieces.contenteditable)
    tilepieces.multiselections.slice(0).forEach((v,i) => {
      if (v.el == tilepieces.elementSelected)
        return;
      tilepieces.core.translateHighlight(v.el, v.highlight);
    });
  if(tilepieces.highlight)
    tilepieces.core.translateHighlight(tilepieces.highlight, tilepieces.editElements.highlight);
  else
    tilepieces.editElements.highlight.style.transform = "translate(-9999px,-9999px)";
  if (tilepieces.elementSelected && tilepieces.editMode == "selection" && !tilepieces.contenteditable)
    tilepieces.core.translateHighlight(tilepieces.elementSelected, tilepieces.editElements.selection);
  drawSelection = requestAnimationFrame(drawSel);
}
function getPropertyComputed(computed, name) {
  var prop = +(computed.getPropertyValue(name).replace("px", ""));
  return prop < 0 ? 0 : prop;
}
TilepiecesCore.prototype.removeSelection = function () {
  tilepieces.editElements.selection.style.transform = "translate(-9999px,-9999px)";
  cancelAnimationFrame(drawSelection);
  drawSelection = null;
}
TilepiecesCore.prototype.selectElement = function (target, match, composedPath = []) {
  var targetToSelect = target.nodeType != 1 ? target.parentNode : target;
  var $self = this;
  if (typeof match === "undefined") {
    match = $self.htmlMatch.find(target)
  }
  if (tilepieces.multiselected &&
    (target.tagName?.match(/HTML|HEAD|BODY/) ||
      !match ||
      tilepieces.multiselections.find(n => n.el.contains(target) || target.contains(n.el)))) {
    console.warn("no match or HTML|HEAD|BODY or el already in multiselection element during multiselection.exit", target);
    return;
  }
  if (!composedPath.length) {
    var swap = target;
    while (swap) {
      composedPath.push(swap);
      swap = swap.parentNode;
    }
  }
  var cssRules = $self.cssMatcher(targetToSelect,
    $self.styles.styleSheets);
  var styles = $self.currentWindow.getComputedStyle(targetToSelect, null);
  var fatherStyle = target.nodeName != "HTML" && targetToSelect.parentNode ?
    $self.currentWindow.getComputedStyle(targetToSelect.parentNode, null) : null;
  var firstRuleMatch = cssRules.cssMatches[1];
  var firstSelector = firstRuleMatch && cssRules.cssMatches[1].rule.selectorText;
  var possibleCssSelector = firstSelector || target.nodeName.toLowerCase() + [...targetToSelect.classList].map(c => "." + c).join("");
  tilepieces.cssSelector = tilepieces.elementSelected == target && tilepieces.cssSelector != possibleCssSelector &&
    cssRules.cssMatches.find(v=>v.rule.selectorText == tilepieces.cssSelector) ? tilepieces.cssSelector : possibleCssSelector;
  var obj = {cssRules, target, styles, fatherStyle, match, composedPath, targetSelected: targetToSelect};
  tilepieces.cssSelectorObj = obj;
  tilepieces.selectorObj = obj;
  tilepieces.elementSelected = target;
  if (tilepieces.multiselected)
    tilepieces.createSelectionClone(target);
  target.tagName == "IMG" &&
  setTimeout(() => {
    tilepieces.editElements.selection.focus();
  });
  //if(target.nodeType==1)
  window.dispatchEvent(
    new CustomEvent("highlight-click", {detail: obj}));
};

TilepiecesCore.prototype.setSelection = function () {
  drawSelection = requestAnimationFrame(drawSel);
}
TilepiecesCore.prototype.translateHighlight = function (target, el, contentRect) {
  if (!target.ownerDocument || !target.ownerDocument.defaultView) // during page change, this function could be fired before being canceled
    return;
  if ([1, 3].indexOf(target.nodeType) == -1)
    return;
  var bound;
  var frameBound = tilepieces.frame.getBoundingClientRect();
  if (target.nodeType != 1) { // text node
    var range = target.getRootNode().createRange();
    range.selectNode(target);
    bound = range.getBoundingClientRect()
  } else // element node
    bound = target.getBoundingClientRect();
  el.style.width = bound.width + "px";
  el.style.height = bound.height + "px";
  var adjust = el.classList.contains("highlight-selection") ? 1 : 0;// 1 is the border of el (.highlight-selection)
  var x = frameBound.x + bound.x; // tilepieces.frame.offsetLeft doesn't work when frame is resized by screen dimensions
  var y = tilepieces.frame.offsetTop + bound.y;
  el.style.transform = `translate(${x - adjust}px,${y - adjust}px)`;
  el.__target = target;
  // draw box, if setted
  if (target == tilepieces.elementSelected && !target.getBBox) {
    drawBox(tilepieces.selectorObj.styles, bound, x, y)
  }
}
TilepiecesCore.prototype.appendKeyframe = function (rule, cssText) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  rule.appendRule(cssText);
  var newRule = rule.cssRules[rule.cssRules.length - 1];
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    rule,
    $self,
    newRule,
    method: "appendKeyframe",
    __historyFileRecord : {oldRecord, newRecord}
  });
  return newRule;
};
historyMethods.appendKeyframe = {
  undo: ho => {
    var notTheRule = [];
    var foundRule = ho.rule.findRule(ho.newRule.keyText);
    var count = 0;
    while (foundRule.cssText != ho.newRule.cssText) {
      notTheRule.push(foundRule);
      ho.rule.deleteRule(ho.newRule.keyText);
      foundRule = ho.rule.findRule(ho.newRule.keyText);
      count++;
      if (count > 500000)
        throw "appendKeyframe error"
    }
    ho.rule.deleteRule(ho.newRule.keyText);
    notTheRule.forEach(v => ho.rule.appendRule(v.cssText));
  },
  redo: ho => {
    ho.rule.appendRule(ho.newRule.cssText);
    var newRule = ho.rule.cssRules[ho.rule.cssRules.length - 1]
    ho.$self.history.entries.forEach(v => {
      if (v == ho) {
        return;
      }
      if (v.rule == ho.newRule)
        v.rule = newRule;
      if (v.newRule == ho.newRule)
        v.newRule = newRule;
      if (v.keyframe == ho.newRule)
        v.keyframe = newRule;
    });
    ho.newRule = newRule;
  }
}
TilepiecesCore.prototype.createCurrentStyleSheet = function(cssText) {
  var $self = this;
  var path = tilepieces.currentPage.path;
  var oldRecord ={path,text:$self.createDocumentText($self.htmlMatch.source)};
  var doc = $self.currentDocument;
  var sourceDoc = $self.htmlMatch.source;
  var oldStyle = $self.currentStyleSheet;
  var oldStyleMatch;
  if (oldStyle) {
    var currentStyleSheetNode = $self.currentStyleSheet.ownerNode;
    oldStyleMatch = $self.matchCurrentStyleSheetNode;
    currentStyleSheetNode.removeAttribute(tilepieces.currentStyleSheetAttribute);
    oldStyleMatch.removeAttribute(tilepieces.currentStyleSheetAttribute);
  }
  var newStyle = $self.currentDocument.createElement("style");
  newStyle.innerHTML = cssText;
  $self.currentDocument.head.appendChild(newStyle);
  var newNodeSource = sourceDoc.head.appendChild(newStyle.cloneNode(true));
  newStyle.setAttribute(tilepieces.currentStyleSheetAttribute, "");
  newNodeSource.setAttribute(tilepieces.currentStyleSheetAttribute, "");
  $self.currentStyleSheet = newStyle.sheet;
  $self.matchCurrentStyleSheetNode = newNodeSource;
  var newRecord = {path, text: $self.createDocumentText($self.htmlMatch.source)};
  [...newStyle.sheet.cssRules].forEach(v=>detectNewClass(v.selectorText));
  $self.setHistory({
    doc,
    sourceDoc,
    $self,
    newNodeSource,
    oldStyle,
    oldStyleEl: oldStyle ? oldStyle.ownerNode : null,
    oldStyleMatch,
    newStyle,
    oldSheet: newStyle.sheet,
    method: "createCurrentStyleSheet",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.createCurrentStyleSheet = {
  undo: ho => {
    ho.newStyle.remove();
    ho.newNodeSource.remove();
    ho.$self.currentStyleSheet = ho.oldStyle ? ho.oldStyle.sheet : null;
    ho.$self.matchCurrentStyleSheetNode = ho.oldStyleMatch ? ho.oldStyleMatch.sheet : null;
    if (ho.oldStyleEl) {
      ho.oldStyleEl.setAttribute(tilepieces.currentStyleSheetAttribute, "");
      ho.oldStyleMatch.setAttribute(tilepieces.currentStyleSheetAttribute, "");
    }
  },
  redo: ho => {
    ho.$self.currentDocument.head.appendChild(ho.newStyle);
    ho.sourceDoc.head.appendChild(ho.newNodeSource);
    ho.newStyle.setAttribute(tilepieces.currentStyleSheetAttribute, "");
    ho.newNodeSource.setAttribute(tilepieces.currentStyleSheetAttribute, "");
    ho.$self.currentStyleSheet = ho.newStyle.sheet;
    ho.$self.matchCurrentStyleSheetNode = ho.newNodeSource;
    ho.$self.history.entries.forEach(v => {
      if (v.stylesheet === ho.oldSheet)
        v.stylesheet = ho.newStyle.sheet;
    });
    ho.oldSheet = ho.newStyle.sheet;
    if (ho.oldStyleEl) {
      ho.oldStyleEl.removeAttribute(tilepieces.currentStyleSheetAttribute);
      ho.oldStyleMatch.removeAttribute(tilepieces.currentStyleSheetAttribute);
    }
  }
}

TilepiecesCore.prototype.deleteCssRule = function (oldRule) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var stylesheet = oldRule.parentRule || oldRule.parentStyleSheet;
  //var parent = rule.parentRule || stylesheet;
  var index = [...stylesheet.cssRules].indexOf(oldRule);
  //var oldRule = stylesheet.cssRules[index];
  var oldCssText = oldRule.cssText;
  stylesheet.deleteRule(index);
  var exIndex;
  if (oldRule.constructor.name == "CSSMediaRule" ||
    oldRule.constructor.name == "CSSSupportsRule") {
    $self.runcssMapper()
  }
  if (oldRule.constructor.name == "CSSKeyframesRule") {
    exIndex = $self.styles.animations.findIndex(v => v.rule == oldRule);
    $self.styles.animations.splice(exIndex, 1);
  }
  if (oldRule.constructor.name == "CSSFontFaceRule") {
    exIndex = $self.styles.fonts.findIndex(v => v.fontFaceRule == oldRule);
    $self.styles.fonts.splice(exIndex, 1);
  }
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    stylesheet,
    oldRule,
    oldCssText,
    $self,
    index,
    exIndex,
    method: "deleteCssRule",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.deleteCssRule = {
  undo: ho => {
    ho.stylesheet.insertRule(ho.oldCssText, ho.index);
    var rule = ho.stylesheet.cssRules[ho.index];
    if (rule.constructor.name == "CSSMediaRule" ||
      rule.constructor.name == "CSSSupportsRule") {
      ho.$self.runcssMapper()
    }
    if (rule.constructor.name == "CSSKeyframesRule")
      ho.$self.styles.animations.splice(ho.exIndex, 0, rule);
    if (rule.constructor.name == "CSSFontFaceRule")
      ho.$self.styles.fonts.splice(ho.exIndex, 0, rule);
    ho.$self.history.entries.forEach(v => {
      if (v.rule == ho.oldRule)
        v.rule = rule;
      if (v.oldRule == ho.oldRule)
        v.oldRule = rule;
      if (v.stylesheet == ho.oldRule)
        v.stylesheet = rule;
    });
    ho.oldRule = rule
  },
  redo: ho => {
    ho.stylesheet.deleteRule(ho.index);
    if (ho.oldRule.constructor.name == "CSSMediaRule" ||
      ho.oldRule.constructor.name == "CSSSupportsRule") {
      if (ho.oldRule == tilepieces.core.currentMediaRule)
        tilepieces.core.currentMediaRule = null;
      ho.$self.runcssMapper()
    }
    if (ho.oldRule.constructor.name == "CSSKeyframesRule") {
      ho.exIndex = ho.$self.styles.animations.findIndex(v => v.rule == ho.oldRule);
      ho.$self.styles.animations.splice(ho.exIndex, 1);
    }
    if (ho.oldRule.constructor.name == "CSSFontFaceRule") {
      ho.exIndex = ho.$self.styles.fonts.findIndex(v => v.fontFaceRule == ho.oldRule);
      ho.$self.styles.fonts.splice(ho.exIndex, 1);
    }
  }
}
TilepiecesCore.prototype.deleteKeyframe = function (rule, keyframe) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var notTheRule = [];
  var foundRule = rule.findRule(keyframe.keyText);
  var count = 0;
  while (foundRule.cssText != keyframe.cssText) {
    notTheRule.push(foundRule);
    rule.deleteRule(keyframe.keyText);
    foundRule = rule.findRule(keyframe.keyText);
    count++;
    if (count > 500000)
      throw "error on find keyframe rule"
  }
  rule.deleteRule(keyframe.keyText);
  notTheRule.forEach(v => rule.appendRule(v.cssText));
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    rule,
    $self,
    keyframe,
    method: "deleteKeyframe",
    __historyFileRecord : {oldRecord, newRecord}
  });
}
historyMethods.deleteKeyframe = {
  undo: ho => {
    ho.rule.appendRule(ho.keyframe.cssText);
    var newRule = ho.rule.cssRules[ho.rule.cssRules.length - 1]
    ho.$self.history.entries.forEach(v => {
      if (v == ho) {
        return;
      }
      if (v.rule == ho.keyframe)
        v.rule = newRule;
      if (v.newRule == ho.keyframe)
        v.newRule = newRule;
      if (v.keyframe == ho.keyframe)
        v.keyframe = newRule;
    });
    ho.keyframe = newRule;
  },
  redo: ho => {
    var notTheRule = [];
    var foundRule = ho.rule.findRule(ho.keyframe.keyText);
    var count = 0;
    while (foundRule.cssText != ho.keyframe.cssText) {
      notTheRule.push(foundRule);
      ho.rule.deleteRule(ho.keyframe.keyText);
      foundRule = ho.rule.findRule(ho.keyframe.keyText);
      count++;
      if (count > 500000)
        throw "error on find keyframe rule"
    }
    ho.rule.deleteRule(ho.keyframe.keyText);
    notTheRule.forEach(v => ho.rule.appendRule(v.cssText));
  }
}
function detectNewClass(selectorText){
  var app = window.tilepieces;
  var selSplitted = selectorText.split(",");
  selSplitted.forEach(v=>{
    v = v.trim();
    if(v.match(app.utils.regexOneClassInSelector)) {
      var className = v.replace(".","");
      !app.core.styles.classes.includes(className) && app.core.styles.classes.push(className)
    }
  })
}
TilepiecesCore.prototype.insertCssRule = function (stylesheet, cssText, index) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  if (!index)
    index = stylesheet.cssRules.length;
  stylesheet.insertRule(cssText, index);
  var newRecord = $self.saveStyleSheet(true);
  var oldRule = stylesheet.cssRules[index];
  detectNewClass(oldRule.selectorText);
  $self.setHistory({
    stylesheet,
    cssText,
    $self,
    index,
    oldRule,
    method: "insertCssRule",
    __historyFileRecord : {oldRecord, newRecord}
  });
  return stylesheet.cssRules[index];
};
historyMethods.insertCssRule = {
  undo: ho => {
    var rule = ho.oldRule;
    ho.stylesheet.deleteRule(ho.index);
    if (rule.constructor.name == "CSSMediaRule" ||
      rule.constructor.name == "CSSSupportsRule") {
      if (rule == tilepieces.core.currentMediaRule)
        tilepieces.core.currentMediaRule = null;
      ho.$self.runcssMapper()
    }
    if (rule.constructor.name == "CSSKeyframesRule") {
      ho.exIndex = ho.$self.styles.animations.findIndex(v => v.rule == ho.oldRule);
      ho.$self.styles.animations.splice(ho.exIndex, 1);
    }
    if (rule.constructor.name == "CSSFontFaceRule") {
      ho.exIndex = ho.$self.styles.fonts.findIndex(v => v.fontFaceRule == ho.oldRule);
      ho.$self.styles.fonts.splice(ho.exIndex, 1);
    }
  },
  redo: ho => {
    if (ho.stylesheet.ownerNode === null) {
      ho.stylesheet = [...ho.$self.currentDocument.styleSheets].find(s => s.href == ho.stylesheet.href);
    }
    ho.stylesheet.insertRule(ho.cssText, ho.index);
    var newRule = ho.stylesheet.cssRules[ho.index];
    if (newRule.constructor.name == "CSSMediaRule" ||
      newRule.constructor.name == "CSSSupportsRule") {
      ho.$self.runcssMapper()
    }
    if (newRule.constructor.name == "CSSKeyframesRule")
      ho.$self.styles.animations.splice(ho.exIndex, 0, newRule);
    if (newRule.constructor.name == "CSSFontFaceRule")
      ho.$self.styles.fonts.splice(ho.exIndex, 0, newRule);
    ho.$self.history.entries.forEach(v => {
      if (v == ho) {
        return;
      }
      if (v.oldRule == ho.oldRule)
        v.oldRule = newRule;
      if (v.rule == ho.oldRule)
        v.rule = newRule;
      if(v.fontFaceRule == ho.oldRule)
        v.fontFaceRule = newRule;
      if (v.stylesheet == ho.oldRule)
        v.stylesheet = newRule;
    });
    ho.oldRule = newRule;
  }
}
TilepiecesCore.prototype.setCss = function (el, name, value, selectorText) {
  var $self = this;
  var currentStylesheet = $self.currentStyleSheet;
  var insertType = tilepieces.insertStyleSheets;
  selectorText = selectorText || tilepieces.cssSelector;
  if (insertType == "stylesheet") {
    /*
    if (el.style.item(name) && $self.htmlMatch.match(el))
      $self.htmlMatch.style(el, name, "");*/
    if (currentStylesheet) {
      // if currentMediaRule exists anymore
      if (tilepieces.core.currentMediaRule &&
        (!tilepieces.core.currentMediaRule.parentStyleSheet ||
          !tilepieces.core.currentMediaRule.parentStyleSheet.ownerNode ||
          !tilepieces.core.currentDocument.documentElement.contains(tilepieces.core.currentMediaRule.parentStyleSheet.ownerNode)
        ))
        tilepieces.core.currentMediaRule = null;
      if (tilepieces.core.currentMediaRule &&
        $self.currentWindow.matchMedia(tilepieces.core.currentMediaRule.conditionText).matches)
        currentStylesheet = tilepieces.core.currentMediaRule;
      var currentRules = [...currentStylesheet.cssRules];
      var decFound = currentRules.find(cssRule => cssRule.selectorText == selectorText);
      if (decFound) {
        $self.setCssProperty(decFound, name, value);
        return decFound.style.getPropertyValue(name);
      } else {
        var index = currentStylesheet.cssRules.length;
        $self.insertCssRule(currentStylesheet, selectorText + `{${name}:${value}}`, index);
        return currentStylesheet.cssRules[index].style.getPropertyValue(name);
      }
    } else {
      $self.createCurrentStyleSheet("");
      $self.insertCssRule($self.currentStyleSheet, selectorText + `{${name}:${value}}`);
      return $self.currentStyleSheet.cssRules[0].style.getPropertyValue(name);
    }
  } else {
    $self.htmlMatch.style(el, name, value, insertType == "inline!important" ? "important" : "");
    return el.style.getPropertyValue(name);
  }
};
TilepiecesCore.prototype.setCssMedia = function (cssText) {
  var $self = this;
  var currentStylesheet = $self.currentStyleSheet;
  if (currentStylesheet) {
    $self.insertCssRule(currentStylesheet, cssText, currentStylesheet.cssRules.length);
  } else {
    //var newStyles = $self.currentDocument.createElement("style");
    //newStyles.innerHTML = cssText;
    //$self.htmlMatch.appendChild($self.currentDocument.head, newStyles);
    //$self.currentStyleSheet = newStyles.sheet;
    $self.createCurrentStyleSheet("");
    $self.insertCssRule($self.currentStyleSheet, cssText);
  }
}
TilepiecesCore.prototype.setCssProperty = function (rule, property, value, priority) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var oldSelector = rule.selectorText;
  var oldValue = rule.style.getPropertyValue(property);
  var oldPriority = rule.style.getPropertyPriority(property);
  if (oldValue == value && oldPriority == priority)
    return;
  rule.style.setProperty(property, value, priority);
  var newProp = rule.style.getPropertyValue(property);
  var newPrior = rule.style.getPropertyPriority(property);
  if (newProp == oldValue && newPrior == oldPriority)
    return;
  var stylesheet = rule.parentStyleSheet;
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    oldSelector,
    rule,
    property,
    stylesheet,
    value,
    $self,
    oldValue,
    oldPriority,
    priority,
    method: "setCssProperty",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.setCssProperty = {
  undo: ho => {
    ho.rule.style.setProperty(ho.property, ho.oldValue, ho.oldPriority);
  },
  redo: ho => {
    ho.rule.style.setProperty(ho.property, ho.value, ho.priority);
  }
}

TilepiecesCore.prototype.setCurrentStyleSheet = function (node) {
  return new Promise((resolve, reject) => {
    try {
      var $self = this;
      var path = tilepieces.currentPage.path;
      var oldRecord ={path,text:$self.createDocumentText($self.htmlMatch.source)};
      var doc = $self.currentDocument;
      var sourceDoc = $self.htmlMatch.source;
      var oldStyle = $self.currentStyleSheet;
      var oldStyleMatch;
      if (oldStyle && oldStyle == node)
        return;
      if (oldStyle) {
        var currentStyleSheetNode = $self.currentStyleSheet.ownerNode;
        if (currentStyleSheetNode) {
          oldStyleMatch = $self.matchCurrentStyleSheetNode;
          currentStyleSheetNode.removeAttribute(tilepieces.currentStyleSheetAttribute);
          oldStyleMatch.removeAttribute(tilepieces.currentStyleSheetAttribute);
        }
      }
      var newNodeSource = $self.htmlMatch.find(node).match;
      node.setAttribute(tilepieces.currentStyleSheetAttribute, "");
      newNodeSource.setAttribute(tilepieces.currentStyleSheetAttribute, "");
      longPollingStyleSheet(node, () => {
        $self.currentStyleSheet = node.sheet;
        $self.matchCurrentStyleSheetNode = newNodeSource;
        var newRecord = {path, text: $self.createDocumentText($self.htmlMatch.source)};
        $self.setHistory({
          doc,
          sourceDoc,
          $self,
          newNodeSource,
          oldStyle,
          oldStyleEl: oldStyle ? oldStyle.ownerNode : null,
          oldStyleMatch,
          oldSheet: node.sheet,
          node,
          method: "setCurrentStyleSheet",
          __historyFileRecord : {oldRecord, newRecord}
        });
        updateStyles($self);
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  })
};
historyMethods.setCurrentStyleSheet = {
  undo: ho => {
    ho.node.removeAttribute(tilepieces.currentStyleSheetAttribute);
    ho.newNodeSource.removeAttribute(tilepieces.currentStyleSheetAttribute);
    ho.$self.currentStyleSheet = ho.oldStyle ? ho.oldStyle.sheet : null;
    ho.$self.matchCurrentStyleSheetNode = ho.oldStyleMatch ? ho.oldStyleMatch.sheet : null;
    if (ho.oldStyleEl) {
      ho.oldStyleEl.setAttribute(tilepieces.currentStyleSheetAttribute, "");
      ho.oldStyleMatch.setAttribute(tilepieces.currentStyleSheetAttribute, "");
    }
  },
  redo: ho => {
    return new Promise((resolve, reject) => {
      try {
        ho.node.setAttribute(tilepieces.currentStyleSheetAttribute, "");
        ho.newNodeSource.setAttribute(tilepieces.currentStyleSheetAttribute, "");
        if (ho.oldStyleEl) {
          ho.oldStyleEl.removeAttribute(tilepieces.currentStyleSheetAttribute);
          ho.oldStyleMatch.removeAttribute(tilepieces.currentStyleSheetAttribute);
        }
        longPollingStyleSheet(ho.node, () => {
          ho.$self.currentStyleSheet = ho.node.sheet;
          ho.$self.matchCurrentStyleSheetNode = ho.newNodeSource;
          ho.$self.history.entries.forEach(v => {
            if (v.stylesheet === ho.oldSheet)
              v.stylesheet = ho.node.sheet;
          });
          ho.oldSheet = ho.node.sheet;
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    })
  }
}

TilepiecesCore.prototype.setKeyText = function (rule, keyText) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var exKeyText = rule.keyText;
  rule.keyText = keyText;
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    rule,
    exKeyText,
    keyText,
    method: "setKeyText",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.setKeyText = {
  undo: ho => {
    ho.rule.keyText = ho.exKeyText;
  },
  redo: ho => {
    ho.rule.keyText = ho.keyText;
  }
}
TilepiecesCore.prototype.setNewClassSelector = function (el) {
  var $self = this;
  var selectorText = "";
  var classMatch = new RegExp(`${tilepieces.classGenerator}\\d+$`);
  [...el.classList].forEach(v => {
    if (v.match(classMatch))
      selectorText = "." + v
  });
  if (!selectorText) {
    $self.classIndex += 1;
    var newClass = tilepieces.classGenerator + $self.classIndex;
    selectorText = "." + newClass;
    $self.htmlMatch.addClass(el, selectorText);
  }
  return selectorText;
};
TilepiecesCore.prototype.setRuleName = function (rule, name) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var exName = rule.name;
  rule.name = name;
  var newRecord = $self.saveStyleSheet(true);
  $self.setHistory({
    rule,
    exName,
    name,
    method: "setRuleName",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.setRuleName = {
  undo: ho => {
    ho.rule.name = ho.exName;
  },
  redo: ho => {
    ho.rule.name = ho.name;
  }
}
TilepiecesCore.prototype.setSelectorText = function (rule, selectorText) {
  var $self = this;
  var oldRecord = $self.saveStyleSheet(true);
  var exSelectorText = rule.selectorText;
  rule.selectorText = selectorText;
  var newRecord = $self.saveStyleSheet(true);
  detectNewClass(selectorText);
  $self.setHistory({
    rule,
    exSelectorText,
    selectorText,
    method: "setSelectorText",
    __historyFileRecord : {oldRecord, newRecord}
  });
};
historyMethods.setSelectorText = {
  undo: ho => {
    ho.rule.selectorText = ho.exSelectorText;
  },
  redo: ho => {
    ho.rule.selectorText = ho.selectorText;
  }
}
function unitConverter(type, cssProperty, elStyles, parentStyles) {
  switch (type) {
    case "px":
      return elStyles[cssProperty];
    case "%":
      var pxValue = elStyles[cssProperty].match(regexNumbers);
      var parentPxValue;
      if (cssProperty == "top" || cssProperty == "left" ||
        cssProperty == "width")
        parentPxValue = parentStyles["width"].match(regexNumbers);
      else
        parentPxValue = parentStyles["height"].match(regexNumbers);
      // pxValue : parentPxValue = % : 100 -> % = ( 100 * pxValue ) / parentPxValue
      var p = (100 * pxValue) / parentPxValue;
      return p + "%";
  }
}
tilepieces.createDocumentText = function (doc, isStyleSheetModification) {
  var $self = this;
  if (isStyleSheetModification && ($self.currentStyleSheet && !$self.currentStyleSheet.href)) {
    var updateStyleSheetHTML = createStyleSheetText($self.currentStyleSheet);
    $self.matchCurrentStyleSheetNode.innerHTML = updateStyleSheetHTML;
  }
  return createDocumentString(doc)
}
TilepiecesCore.prototype.createDocumentText = tilepieces.createDocumentText;

function createStyleSheetText(styleSheet) {
  return [...styleSheet.cssRules].map(v => v.cssText).join("\n")
}
TilepiecesCore.prototype.saveStyleSheet = function (dontSave) {
  var $self = this;
  var isStyleTag = !$self.matchCurrentStyleSheetNode ||
    $self.matchCurrentStyleSheetNode.tagName == "STYLE";
  var text = isStyleTag ?
    $self.createDocumentText($self.htmlMatch.source, true) :
    createStyleSheetText($self.currentStyleSheet);
  // TODO : ???? maybe a config BASEPATH
  var path = isStyleTag ?
    tilepieces.currentPage.path :
    decodeURI($self.currentStyleSheet.href)
      .replace(location.origin, "")
      .replace(tilepieces.frameResourcePath(), "")
      .replace(/\/\//g, "/");
  !dontSave && tilepieces.updateFile(path, text);
  return {path, text}
};
tilepieces.toUpdateFileObject = {};
tilepieces.updateFile = (path, text, delay) => {
  return new Promise((resolve, reject) => {
    var updateFunction = tilepieces.storageInterface?.update;
    if(updateFunction) {
      clearTimeout(tilepieces.toUpdateFileObject[path]);
      tilepieces.toUpdateFileObject[path] = setTimeout(() => {
        var blobFile = new Blob([text]);
        updateFunction(path, blobFile)
          .then(r => {
              console.log("[UPDATING FILE] -> path updated: ", path, "\nresult: ", r);
              if (tilepieces.fileSelected.path == path) {
                tilepieces.fileSelected.file = text;
                tilepieces.fileSelected.fileText = text;
              }
              window.dispatchEvent(new CustomEvent("file-updated", {detail: {path, text}}));
              delete tilepieces.toUpdateFileObject[path];
              resolve(text);
            },
            err => {
              console.error("[UPDATING FILE] -> error updating path", err);
              window.dispatchEvent(new CustomEvent("error-file-updated", {detail: {path, text}}));
              dialog.open("error during updating current document");
              delete tilepieces.toUpdateFileObject[path];
              reject(err);
            });
      }, typeof delay !== "number" ? tilepieces.delayUpdateFileMs : delay)
    }
    else{
      resolve();
    }
  })
};
function commonPath(one, two) {
  var length = Math.min(one.length, two.length);
  var pos;

  // find first non-matching character
  for (pos = 0; pos < length; pos++) {
    if (one.charAt(pos) !== two.charAt(pos)) {
      pos--;
      break;
    }
  }

  if (pos < 1) {
    return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
  }

  // revert to last /
  if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
    pos = one.substring(0, pos).lastIndexOf('/');
  }

  return one.substring(0, pos + 1);
};
function convertGroupingRuleToSelector(selector, rule) {
  var header = rule.type == window.CSSRule.SUPPORTS_RULE
    ? "@supports" : "@media";
  selector = `${header} ${rule.conditionText}{${selector}{}}`;
  var swapRule = rule;
  while (swapRule.parentRule) {
    header = swapRule.parentRule.type == window.CSSRule.SUPPORTS_RULE
      ? "@supports" : "@media";
    selector = header + " " + swapRule.parentRule.conditionText + "{" + selector + "}";
    swapRule = swapRule.parentRule;
  }
  return selector;
}
function createDocumentString(doc,maxTrim) {
  var regexToReplace = maxTrim ? /([\u200B-\u200D\uFEFF]|\n|\t|\r)/g : /[\u200B-\u200D\uFEFF]/g;
  var body = doc.documentElement.outerHTML.replace(regexToReplace, "");
  if (doc.doctype) {
    var doctype = {
      name: doc.doctype.name,
      publicId: doc.doctype.publicId,
      systemId: doc.doctype.systemId
    };
    var dctype = '<!DOCTYPE ' + doctype.name;
    if (doctype.publicId.length) dctype += ' PUBLIC "' + doctype.publicId + '"';
    if (doctype.systemId.length) dctype += ' "' + doctype.systemId + '"';
    dctype += ">\r\n";
    return dctype + body;
  }
  return '<!DOCTYPE html>' + body;
}
function dialogNameResolver(file, ext, label, noprocess ) {
  return new Promise((resolve, reject) => {
    var prompt = promptDialog({
      label: label || "Insert file ." + ext + " name:",
      buttonName: "CREATE",
      checkOnSubmit: true,
      patternFunction: (value, target) => {
        value = value.trim();
        return !value.match(/[()\/><?:%*"|\\]+/);
      },
      patternExpl: "file name cannot contain /\\?%*:|\"<> characters"
    });
    prompt.events.on("submit",prompte => {
      dialog.open("processing file...", true);
      if(!noprocess)
       tilepieces.utils.processFile(file, tilepieces.miscDir + "/" + prompte + "." + ext)
        .then(filepath => {
          dialog.close();
          resolve(filepath)
        }, err => reject(err));
      else resolve(prompte)
    });
    prompt.events.on("reject",prompte =>{
      reject();
    });
  });
}
function download(filename, blobURL) {
  var element = document.createElement('a');
  element.setAttribute('href', blobURL);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  window.URL.revokeObjectURL(blobURL);
}
function elementSum(DOMel) {
  return `<span class=element-sum-tag-name>${DOMel.tagName.toLowerCase()}</span>`+
    `${DOMel.id ? `<span class=element-sum-id>#${DOMel.id}</span>` : ``}`+
    `${DOMel.classList.length ? `<span class=element-sum-classes>.${[...DOMel.classList].join(".")}</span>` : ``}`
}
function getDimension(el, cssString, property = "width") {
  var old = el.style.getPropertyValue(property);
  var win = el.ownerDocument.defaultView;
  el.style.setProperty(property, cssString, "important");
  var px = +(win.getComputedStyle(el, null)[property].replace("px", ""));
  el.style.setProperty(property, old);
  return px;
}
function getDocumentPath(doc) {
  var currentDoc = doc || tilepieces.core.currentDocument;
  var frameResourcePath = encodeURI(tilepieces.utils.paddingURL(tilepieces.frameResourcePath()));
  return currentDoc.location.pathname.replace(frameResourcePath, "");
}
function getHashes(){
  var hash = location.hash.substring(1);
  return hash.split("&").reduce((acc,v)=>{
    var values = v.split("=");
    acc[decodeURIComponent(values[0])] = decodeURIComponent(values[1]);
    return acc;
  },{})
}
function getRelativePath(absolutePathDoc, absolutePathSource) {
  // we don't need the starting "/", if there is
  if (absolutePathDoc[0] == "/")
    absolutePathDoc = absolutePathDoc.substring(1);
  if (absolutePathSource[0] == "/")
    absolutePathSource = absolutePathSource.substring(1);
  var common = commonPath(absolutePathDoc, absolutePathSource);
  absolutePathDoc = absolutePathDoc.replace(common, "");
  absolutePathSource = absolutePathSource.replace(common, "");
  var absolutePathDocSplit = absolutePathDoc.split("/");
  var arr = [];
  absolutePathDocSplit.forEach((v, i, a) => {
    if (i != a.length - 1)
      arr.push("../")
  });
  return arr.join("") + absolutePathSource
}
function importProjectAsZip(blobFile) {
  return new Promise(async (resolve, reject) => {
    var app = tilepieces;
    var zip = await app.utils.newJSZip();
    try {
      var contents = await zip.loadAsync(blobFile);
      var projectsData = contents.files["tilepieces.projects.json"];
      var projects;
      if (!projectsData) {
        console.warn("zip doesn't contain 'tilepieces.projects.json'");
        var projectName = await app.utils.dialogNameResolver(null, null, "no 'tilepieces.projects.json' found. " +
          "Tilepieces will import the entire zip: Please type the new project name", true );
        projects = [{
          path : "",
          name : projectName
        }]
      }
      else{
        projects = JSON.parse(await projectsData.async("string"));
      }
      for (var i = 0; i < projects.length; i++) {
        var p = projects[i];
        var name = p.name;
        var path = p.path;
        dialog.open("importing project '" + name + "'", true);
        await app.storageInterface.create(name);
        await app.getSettings();
        app.updateSettings(name);
        var files = [];
        zip.folder(path).forEach((relativePath, file) => {
          if (!file.dir)
            files.push({relativePath, file})
        });
        for (var f = 0; f < files.length; f++) {
          var file = files[f];
          dialog.open("importing project '" + name + "' : " + file.relativePath, true);
          await app.storageInterface.update(file.relativePath, new Blob([await file.file.async("arraybuffer")]));
        }
        delete p.path;
        dialog.open("importing project '" + name + "' metadata", true);
        var component;
        if (p.components) {
          for (var icomp = 0; icomp < p.components.length; icomp++) {
            component = p.components[icomp];
            await app.storageInterface.createComponent({local: true, component})
          }
        }
        if(!p.lastFileOpened) {
          try{
            await app.storageInterface.read("index.html");
            p.lastFileOpened = "index.html";
          }
          catch(e) {
            var search = await app.storageInterface.search("", "**/*.html");
            p.lastFileOpened = search.searchResult[0] || null;
          }
        }
        await app.storageInterface.setSettings({
          projectSettings: p
        });
      }
      await app.getSettings();
      window.dispatchEvent(new CustomEvent('set-project', {
        detail: {name:projects[projects.length-1].name,lastFileOpened:p.lastFileOpened}
      }))
      resolve();
    } catch (err) {
      reject(err);
    }
  })
}
async function newJSZip(){
  if (!tilepieces.JSZip) {
    await import("/modules/tilepieces/jszip/jszip.min.js");
    tilepieces.JSZip = JSZip
  }
  return new tilepieces.JSZip();
}
function notAdmittedTagNameInPosition(tagName, composedPath) {
  tagName = tagName.toUpperCase(); // SVG return a lower case tagName
  var doc = composedPath[0].ownerDocument;
  if (tagName == "MAIN")
    return doc.querySelector("main:not([hidden])") ||
      composedPath.find(v => v.tagName &&
        !v.tagName.match(/^(HTML|BODY|DIV|FORM)$/));
  if (tagName.match(tilepieces.utils.phrasingTags))
    return composedPath.find((v, i) =>
        v.tagName && (
          (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
          v.tagName.match(tilepieces.utils.notEditableTags)
        )
    );
  if (tagName.match(tilepieces.utils.restrictedFlowInsideTags))
    return composedPath.find((v, i) => v.tagName && (
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
        (tagName != "P" && v.tagName == "ADDRESS") ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags) ||
        v.tagName.match(tilepieces.utils.notEditableTags) ||
        v.tagName.match(tilepieces.utils.phrasingTags)
      )
    );
  if (tagName.match(/^(ARTICLE|SECTION|NAV|ASIDE|ADDRESS)$/))
    return composedPath.find((v, i) => v.tagName && (
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
        v.tagName == "ADDRESS" ||
        v.tagName.match(tilepieces.utils.notEditableTags) ||
        v.tagName.match(tilepieces.utils.phrasingTags) ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
      )
    );
  if (tagName.match(/^(HEADER|FOOTER)$/))
    return composedPath.find((v, i) => v.tagName && (
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
        v.tagName.match(/^(ADDRESS|FOOTER|HEADER)$/) ||
        v.tagName.match(tilepieces.utils.notEditableTags) ||
        v.tagName.match(tilepieces.utils.phrasingTags) ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
      )
    );
  if (tagName == "FORM")
    return composedPath.find((v, i) => v.tagName && (
        v.tagName == "FORM" ||
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
        v.tagName.match(tilepieces.utils.notEditableTags) ||
        v.tagName.match(tilepieces.utils.phrasingTags) ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
      )
    );
  if (tagName == "DIV")
    return composedPath.find((v, i) => v.tagName && (
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0 && v.tagName != "DL") ||
        v.tagName.match(tilepieces.utils.phrasingTags) ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
      )
    );
  if (tagName == "LI")
    return !composedPath[0].tagName.match(/^(UL|OL)$/);
  if (tagName.match(/^(DD|DT)$/))
    return composedPath[0].tagName != "DL";
  if (tagName == "SOURCE")
    return !composedPath[0].tagName.match(/^(VIDEO|AUDIO|PICTURE)$/);
  if (tagName.match(/^(META|LINK|STYLE)$/))
    return composedPath[0].tagName != "HEAD";
  if (tagName == "TITLE")
    return composedPath[0].tagName != "HEAD" || doc.querySelector("title");
  if (tagName.match(/^(CAPTION|COLGROUP|THEAD|TBODY|TFOOT)$/))
    return composedPath[0].tagName != "TABLE";
  if (tagName.match(/^(TD|TH)$/))
    return composedPath[0].tagName != "TR";
  if (tagName == "TR")
    return !composedPath[0].tagName.match(/THEAD|TBODY|TFOOT/);
  if (tagName == "TRACK")
    return !composedPath[0].tagName.match(/VIDEO|AUDIO/);
  if (tagName == "OPTGROUP")
    return composedPath[0].tagName != "SELECT";
  if (tagName == "OPTION")
    return !composedPath[0].tagName.match(/SELECT|OPTGROUP|DATALIST/);
  if (tagName.match(/^(HTML|BODY|HEAD)$/))
    return true;
  if(tilepieces.utils.svgTags.indexOf(tagName.toLowerCase())>-1)
    return !composedPath.find(v=>v.tagName == "svg")
  return composedPath.find((v, i) => v.tagName && (
      (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
      v.tagName.match(tilepieces.utils.notEditableTags) ||
      v.tagName.match(tilepieces.utils.phrasingTags) ||
      v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
    )
  )
}
function paddingURL(url) {
  if (url[0] != "/")
    url = "/" + url;
  if (!url.endsWith("/"))
    url += "/";
  return url;
}
async function processFile(file, path, docPath) {
  if (Number(tilepieces.imageTypeProcess) == 64) {
    return new Promise((res, rej) => {
      var reader = new FileReader();
      reader.addEventListener("load", () => res(reader.result));
      reader.addEventListener("abort", e => {
        dialog.open(e.toString());
        rej(e);
      });
      reader.addEventListener("error", e => {
        dialog.open(e.toString());
        rej(e);
      });
      reader.readAsDataURL(file);
    })
  }
  path = path || (tilepieces.utils.paddingURL(tilepieces.miscDir) + file.name);
  await tilepieces.storageInterface.update(path, file);
  return tilepieces.relativePaths ? tilepieces.utils.getRelativePath(docPath || tilepieces.utils.getDocumentPath(),
    path) : path[0] == "/" ? path : "/" + path;
}
async function setFixedHTMLInProject(component){
  var app = tilepieces;  
  var fixedHTMLPath = component.path + "/" + component.html;
  try {
    dialog.open("fetching resource...", true, true);
    var html = await app.storageInterface.read(fixedHTMLPath);
    var htmlfiles = await app.storageInterface.search("", "**/*.html");
    var parser = new DOMParser();
    var HTMLdoc = parser.parseFromString(html, "text/html");
    var fragment = HTMLdoc.createDocumentFragment();
    [...HTMLdoc.body.children].forEach(v => {
      if (!v.tagName.match(/STYLE|LINK|SCRIPT/)) {
        v.setAttribute(app.componentAttribute, component.name);
        fragment.append(v)
      }
    });
    for (var i = 0; i < htmlfiles.searchResult.length; i++) {
      var htmlfilePath = htmlfiles.searchResult[i];
      if (htmlfilePath.replace(/^\/|\/$/g, "") ==
        fixedHTMLPath.replace(/^\/|\/$/g, "")) {
        console.log("[set fixed HTML, prevent writing on itself]",htmlfilePath,fixedHTMLPath);
        continue;
      }
      dialog.open("fetching file path " + htmlfilePath + "...", true, true);
      var htmlfile = await app.storageInterface.read(htmlfilePath);
      parser = new DOMParser();
      var doc = parser.parseFromString(htmlfile, "text/html");
      var toChange = doc.querySelectorAll(`[${app.componentAttribute}="${component.name}"]`);
      if (toChange.length) {
        toChange.forEach(v => {
          !v.tagName.match(/SCRIPT|LINK|STYLE/) &&
          v.replaceWith(fragment.cloneNode(true))
        });
        var s = app.core.createDocumentText(doc);
        await app.storageInterface.update(htmlfilePath, new Blob([s]));
      }
    }
  } catch (e) {
    console.error(e);
    dialog.close();
    alertDialog("error in set fixed html",true);
    return;
  }
  dialog.open("update done");
}
tilepieces.utils.svgTags = ['a', 'animate', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'defs', 'desc', 'discard', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'stop', 'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tspan', 'use', 'view']
// https://stackoverflow.com/questions/33704791/how-do-i-uninstall-a-service-worker
function unregisterSw() {
  return new Promise((resolve, reject) => {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        try {
          for (let registration of registrations) {
            var scriptUrl = registration.scriptURL;
            tilepieces.serviceWorkers.indexOf(scriptUrl) < 0 &&
            registration.unregister()
          }
        } catch (e) {
          reject(e)
        }
        resolve();
      }, reject)
  })
}
})();