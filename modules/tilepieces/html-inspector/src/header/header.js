let opener = window.opener || window.parent || window;
let overlay = document.getElementById("overlay");
let overlayInner = document.getElementById("overlay-inner");
//
let selected;
let selectedIsMatch;
let treeBuilder;
let app = opener.tilepieces;
let over;
let resizeObserver;
let isPasteEvent;
let attributeSelected;
let tooltipEl = document.querySelector(".frontart-tooltip");
let multiselectionToolTip = document.getElementById("multiselection-tooltip");
let tooltipElHide;
let cut;
let copy;
let paste;
let isAutoInsertionFlag;
let history = {
  entries: [],
  pointer: 0
};
let historyMethods = {};
let treeChangeEv = "tree-change";

/* search elements */
let searchBar = document.getElementById("search-bar");
let searchBarEntries = document.getElementById("search-bar-entries");
let searchBarUp = document.getElementById("search-bar-up");
let searchBarDown = document.getElementById("search-bar-down");
let findButton = document.getElementById("find-button");
let searchSelected = searchBar.children[1];
let pointer = 0;
let selectionText = "";
let selections = [];
let currentSearchEl;

let htmlTreeBuilderOptions = {
  preventDefaultClickOnMs: (e, target) => {
    if ((e.shiftKey || e.ctrlKey) && target != selected) {
      var matchLLI = app.core.htmlMatch.find(target["__html-tree-builder-el"]);
      if (!matchLLI) {
        target.classList.add("not-match");
        return;
      } else
        target.classList.remove("not-match");
      if (!treeBuilder.multiselection)
        multiselectButton.click();
      if (selectedIsMatch && e.shiftKey) {
        multiselectionOnShiftKey(target, matchLLI);
        return true;
      }
    } else if (e.shiftKey || e.ctrlKey) {
      if (!treeBuilder.multiselection) {
        multiselectButton.click();
        return true;
      }
    }
  }
}
// multiselect
let multiselectButton = document.getElementById("multiselect");
let multiSelection;
let internalMultiremove;
const menuBarTabs = document.querySelectorAll(".menu-bar-tabs");

// CSS VIEW
const cssViewDOM = document.getElementById("css-view");
const cssViewDOMList = document.getElementById("css-view-list");
const cssViewTooltip = document.getElementById("css-view-tooltip");
const addStylesheetModal = document.getElementById("add-stylesheet-modal-template");
const addStyleSheetButton = document.getElementById("add-stylesheet");
let stylesheetTagSelect,
  stylesheetTagPosition,
  isStyleSheetPending;
/*
let selectedCSS,
    selectedCSSMatch,
    autoInsertionCss,
    multiSelectionCss = [];*/

const jsViewDOM = document.getElementById("js-view");
const jsViewDOMList = document.getElementById("js-view-list");
const jsViewTooltip = document.getElementById("js-view-tooltip");
const addScriptModal = document.getElementById("add-script-modal-template");
const addScriptButton = document.getElementById("add-script");

let selectedJsCSS,
  selectedJsCSSMatch,
  autoInsertionJsCss,
  multiSelectionJsCss = [];

let jsDragList = cssJsMove(jsViewDOMList);
let cssDragList = cssJsMove(cssViewDOMList);
cssJsKeyDown(jsViewDOMList);
cssJsKeyDown(cssViewDOMList);
onListClick(jsViewDOMList, jsViewTooltip, handleJsTooltip);
onListClick(cssViewDOMList, cssViewTooltip, handleCssTooltip);
cssJsTooltipEvent(jsViewTooltip);
cssJsTooltipEvent(cssViewTooltip);

// block/unblock on events
opener.addEventListener("content-editable-start", e => {
  overlay.ownerDocument.body.classList.add("content-editable-start");
});
opener.addEventListener("content-editable-end", e => {
  overlay.ownerDocument.body.classList.remove("content-editable-start");
  treeBuilder.highlightElement(app.elementSelected)
});
if (app.contenteditable) {
  overlay.ownerDocument.body.classList.add("content-editable-start")
}