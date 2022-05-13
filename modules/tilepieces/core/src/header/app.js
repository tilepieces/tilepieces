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
  version : "0.1.14",
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