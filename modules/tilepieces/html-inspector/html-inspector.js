(()=>{
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
function activateAttributeContentEditable(attributeSpan, target) {
  var sel = overlay.ownerDocument.defaultView.getSelection();
  var range = sel.anchorNode ? sel.getRangeAt(0) : overlay.ownerDocument.createRange();
  attributeSpan.setAttribute("contenteditable", "");
  attributeSpan.addEventListener("blur", addAttributeValidation);
  attributeSpan.addEventListener("paste", onAttrPaste);
  attributeSpan.addEventListener("keydown", attributeKeyDown);
  attributeSpan.focus();
  setTimeout(() => {
    sel.removeAllRanges();
    range.selectNodeContents(target);
    sel.addRange(range);
  })
}

function activateTextNodeContentEditable() {
  var s = selected.querySelector(".html-tree-builder-node-value");
  s.setAttribute("contenteditable", "");
  s.addEventListener("blur", changeText);
  s.addEventListener("paste", onAttrPaste);
  s.addEventListener("keydown", e => e.key == "Enter" && s.blur());
  s.focus();
}
function addAttribute() {
  var attributes = [...selected.children[0].children].find(v => v.classList.contains("html-tree-builder-attributes"));
  if (!attributes) {
    var pivot = selected.querySelector(".html-tree-builer__tag-span");
    attributes = document.createElement("span");
    attributes.className = "html-tree-builder-attributes";
    selected.insertBefore(attributes, pivot.nextSibling);
  }
  attributes.classList.remove("no-pad");
  var newAttrsSpan = document.createElement("span");
  newAttrsSpan.className = "new-attr-span";
  newAttrsSpan.setAttribute("spellcheck", "false");
  newAttrsSpan.setAttribute("contenteditable", "");
  attributes.appendChild(newAttrsSpan);
  newAttrsSpan.addEventListener("blur", addAttributeValidation);
  newAttrsSpan.addEventListener("paste", onAttrPaste);
  newAttrsSpan.addEventListener("keydown", attributeKeyDown);
  newAttrsSpan.focus();
}

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  var win = el.ownerDocument.defaultView;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= win.innerHeight &&
    rect.right <= win.innerWidth
  );
}
function enableTooltipActions(setArray, inversed) {
  if (!setArray.length && !inversed)
    tooltipElHide = true;
  else {
    [...tooltipEl.children].forEach(child => {
      if (child.classList.contains("multiselection-tooltip"))
        return;
      if (!child.dataset.name) {
        var search = child.previousElementSibling;
        var enabled = false;
        while (search != tooltipEl.children[0] && search.tagName != "HR") {
          if (search.getAttribute("disabled") == null) {
            enabled = true;
            break;
          }
          search = search.previousElementSibling;
        }
        if (enabled)
          child.style.display = "block";
        else
          child.style.display = "none";
      } else if ((setArray.find(v => v == child.dataset.name) && inversed) ||
        (!setArray.find(v => v == child.dataset.name) && !inversed))
        child.setAttribute("disabled", "");
      else
        child.removeAttribute("disabled");
    });
    tooltipElHide = false;
  }
}
opener.addEventListener('html-tree-builder-click', handleClick);
window.addEventListener('blur', e => {
  tooltipEl.style.display = "none"
});
overlay.addEventListener('keydown', onKeyDown);
overlay.addEventListener('click', e => {
  if (!treeBuilder) // on load, when we open the html and the body.
    return;
  var target = e.target;
  /* toggle tooltip */
  if (tooltipEl.style.display == "block" && !tooltipEl.contains(target)) {
    tooltipEl.style.display = "none";
    return;
  }
  /* activate tooltip */
  var menuToggle = target.closest(".menu-toggle");
  if (!menuToggle)
    return;
  /* multiselection */
  var multiselection = treeBuilder.multiselection;
  if (multiselection) {
    tooltipEl.classList.add("multiselection");
    tooltipHandle({target});
    !tooltipElHide && tooltip(e);
  } else if (selectedIsMatch) {
    tooltipEl.classList.remove("multiselection");
    tooltipHandle({target});
    !tooltipElHide && tooltip(e);
  }
});
overlay.addEventListener("dblclick", dblclick);
overlay.addEventListener("contextmenu", contextMenu);
overlayInner.addEventListener("html-tree-builder-mouseover", e => {
  var target = e.detail.nodeType == 1 ? e.detail : e.detail.parentNode;
  app.highlight = target
});
overlayInner.addEventListener("html-tree-builder-mouseout", e => app.highlight = null);
opener.addEventListener("html-rendered", e => {
  treeBuilder && treeBuilder.destroy();
  overlay.ownerDocument.body.hidden = false;
  treeBuilder = htmlTreeBuilder(overlayInner, e.detail.htmlDocument, htmlTreeBuilderOptions);
  if (app.multiselected)
    treeBuilder.activateMultiSelection();
});
opener.addEventListener("frame-DOM-selected", e => {
  treeBuilder && treeBuilder.highlightElement(e.detail.target);
});
opener.addEventListener("highlight-click", function (e) {
  if (overlay.style.display == "none") {
    if(!selectedJsCSS || selectedJsCSS["__html-tree-builder-el"] != e.detail.target){
      selectedTab.classList.remove("selected");
      overlay.ownerDocument.querySelector(selectedTab.getAttribute("href")).style.display = "none";
      selectedTab = null;
      overlay.style.display = "block";
    }
    else return;
  }
  if (selected && selected["__html-tree-builder-el"] == e.detail.target)
    return;
  selected = treeBuilder.highlightElement(e.detail.target);
  if (!toMatch(app.selectorObj.match))
    selected.classList.add("not-match");
});
opener.addEventListener("tilepieces-mutation-event", mutation);

// ON READY
function htmlInspectorInit() {
  if (app && app.core && app.core.currentDocument) {
    overlay.ownerDocument.body.hidden = false;
    treeBuilder = htmlTreeBuilder(overlayInner, app.core.currentDocument, htmlTreeBuilderOptions);
    if (app.elementSelected) {
      selected = treeBuilder.highlightElement(app.elementSelected);
      if (!toMatch(app.selectorObj.match))
        selected.classList.add("not-match");
    }
    app.treeBuilder = treeBuilder;
    if (app.multiselected) {
      multiselectButton.classList.add("selected")
      treeBuilder.activateMultiSelection();
    }
  }
  else
    overlay.ownerDocument.body.hidden = true;
}

htmlInspectorInit();
opener.addEventListener("deselect-multielement", e => {
  if (internalMultiremove) {
    internalMultiremove = false;
    console.warn("exit from multiselected", e);
    return;
  }
  var el = e.detail;
  var index = treeBuilder.multiselected.findIndex(v => v.el == el);
  if (index < 0) {
    console.error("[html-inspector] deselect multielement not exists in treeBuilder.multiselected", e);
    return;
  }
  treeBuilder.removeItemSelected(index);
  selected = treeBuilder.selected;
});
opener.addEventListener("html-tree-remove-multiselection", e => {
  internalMultiremove = true;
  selected = treeBuilder.selected;
  var index = app.multiselections.findIndex(v => v.el == e.detail.el);
  if (index < 0) {
    console.error("[html-inspector] deselect multielement not exists in treeBuilder.multiselected", e);
    return;
  }
  app.removeItemSelected(index);
  /*
  app.multiselections.forEach((v,i)=>{
    if(treeBuilder.multiselected[i])
      v.el = treeBuilder.multiselected[i].el
  })*/
});
opener.addEventListener("deselect-element", e => {
  if (!treeBuilder.multiselection) {
    selected = null;
    treeBuilder.deSelect();
  }
});
/*
opener.addEventListener("multiselection-enabled",e=>{
    if(!multiselectButton.classList.contains("selected")){
        treeBuilder.activateMultiSelection();
        app.enableMultiselection();
    }
})
 */
opener.addEventListener("multiselection-canceled", e => {
  if (multiselectButton.classList.contains("selected")) {
    multiselectButton.click();
  }
})

function destroyTreeBuilder() {
  var selectedButtons = overlay.ownerDocument.querySelectorAll(".tab-buttons-inside .selected");
  selectedButtons.forEach(v=>{
    try{
      v.click();
    }
    catch(e){
      console.error(e);
      overlay.ownerDocument.defaultView.location.reload();
    }
  })
  treeBuilder.destroy();
  overlayInner.innerHTML = "";
  overlay.ownerDocument.body.hidden = true;
}

opener.addEventListener("set-project", destroyTreeBuilder);
opener.addEventListener("delete-project", destroyTreeBuilder);
opener.addEventListener("frame-unload",destroyTreeBuilder)


window.addEventListener("window-popup-open", e => {
  var newWindow = e.detail.newWindow;
  if (!selected)
    selected = newWindow.document.querySelector(".html-tree-builder__highlight");
  selected && newWindow.scrollTo(0, selected.offsetTop);
  newWindow.addEventListener('blur', e => {
    tooltipEl.style.display = "none";
    cssViewTooltip.style.display = "none";
  });
  newWindow.addEventListener("resize",e=>{
    var highlights = newWindow.document.querySelectorAll(".html-tree-builder__highlight");
    highlights.forEach(h=>{
      var treeBuilderElement = h.querySelector(".html-tree-builder__tag");
      var toggleWrapper = h.querySelector(".menu-toggle-wrapper");
      toggleWrapper.style.height = treeBuilderElement.offsetHeight + "px";
    })
  });
});
window.addEventListener("window-popup-close", e => {
  //htmlInspectorInit();
  var newWindow = e.detail.panelElementIframe.contentWindow;
  selected && newWindow.scrollTo(0, selected.offsetTop);
});
function toMatch(match) {
  var sourceTarget = selected["__html-tree-builder-el"];
  //var toMatch = sourceTarget.nodeType == 3 ? sourceTarget.parentNode : sourceTarget;
  selectedIsMatch = match || app.core.htmlMatch.find(sourceTarget);
  if (sourceTarget.nodeType == 3 && selectedIsMatch)
    selectedIsMatch = selectedIsMatch.HTML && selectedIsMatch;
  if (!selectedIsMatch) {
    console.warn("no match :", toMatch);
    //selectedIsMatch = false;
    //return false;
  }
  //else
  //selectedIsMatch = true;
  return selectedIsMatch;
}
function tooltip(e, el) {
  //overlay.blur();
  var domElement = el || tooltipEl;
  if (domElement.contains(e.target) || domElement == e.target)
    return;
  var win = e.target.getRootNode().defaultView;
  var x = e.pageX;
  var y = e.pageY;
  var zero = win.scrollY;
  if (domElement.style.display != "block") {
    domElement.style.display = "block";
  }
  var sel = domElement.querySelector(".selected");
  sel && sel.classList.remove("selected");
  var box = domElement.getBoundingClientRect();
  if (x + box.width > win.innerWidth) {
    x = x - box.width;
    if (x < zero) x = zero;
  }
  if (y + box.height > win.innerHeight) {
    y = y - box.height;
    if (y < zero) y = zero;
  }
  domElement.style.transform = `translate(${x}px,${y}px)`;
  domElement.focus();
}
function addAttributeValidation(e) {
  e.target.removeEventListener("blur", addAttributeValidation);
  e.target.removeEventListener("paste", onAttrPaste);
  e.target.removeEventListener("keydown", attributeKeyDown);
  var newFakeEl = document.createElement("fake");
  var s = e.target.closest("li");
  var attributes = s.querySelector(".html-tree-builder-attributes");
  var el = s["__html-tree-builder-el"];
  newFakeEl.innerHTML = "<span " + attributes.innerText + "></span>"
  while (el.attributes.length) {
    isAutoInsertionFlag = true;
    app.core.htmlMatch.removeAttribute(el, el.attributes[0].nodeName)
  }
  newFakeEl.firstChild && ([...newFakeEl.firstChild.attributes]).forEach(v => {
    var name = v.name.trim().replace(/\u00A0/, " ");
    if (!name)
      return;
    var value = v.value.trim().replace(/\u00A0/, " ");
    isAutoInsertionFlag = true;
    try {
      app.core.htmlMatch.setAttribute(el, name, value);
    } catch (e) {
      console.error(e)
    }
  });
  attributes.outerHTML = treeBuilder.createAttributes(el.attributes);
}
function attributeKeyDown(e) {
  var attributeSpan = e.target;
  if (e.key == "Enter") {
    attributeSpan.blur();
    return;
  }
  if (e.key == "Tab" &&
    attributeSpan.nextElementSibling &&
    attributeSpan.nextElementSibling.classList.contains("html-tree-builder-attribute")) {
    e.preventDefault();
    var attr = attributeSpan.nextElementSibling;
    var span = attr.querySelector(".attribute-value") || attr.querySelector(".attribute-key");
    attributeSpan.blur();
    activateAttributeContentEditable(attr, span);
  }
}
function onAttrPaste(e) {
  e.preventDefault();
  var t = e.target;
  var clipboardData = e.clipboardData;
  if (clipboardData && clipboardData.getData) {
    var text = clipboardData.getData("text/plain");
    if (text.length) {
      var sel, range;
      sel = t.ownerDocument.defaultView.getSelection();
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(t.ownerDocument.createTextNode(text));
    }
  }
}
function changeText(e) {
  var el = selected["__html-tree-builder-el"];
  isAutoInsertionFlag = true;
  app.core.htmlMatch.textContent(el, e.target.textContent);
}
function delEl(t, s, autoInsertion = true) {
  isAutoInsertionFlag = autoInsertion;
  app.core.htmlMatch.removeChild(t);
  s.parentNode.removeChild(s);
}

function deleteEl() {
  if (treeBuilder.multiselection) {
    /*
    treeBuilder.multiselected.forEach(n=>{
        delEl(n.el,n.listEl);
    });
    treeBuilder.removeMultiSelection();
    app.destroyMultiselection();
   */
    treeBuilder.multiselected.forEach(n => {
      delEl(n.el, n.listEl);
    });
    multiselectButton.click();
  } else
    delEl(selected["__html-tree-builder-el"], selected);
  selected = null;
  app.core.deselectElement();
}
function editInnerHtml() {
  var t = document.createElement("div");
  var ul = selected.querySelector("ul");
  var realEl = selected["__html-tree-builder-el"];
  var innerHTML = realEl.innerHTML;
  //ul && ul.replaceWith(t);
  //!ul && selected.appendChild(t);
  var type = realEl.tagName == "STYLE" ? "css" :
    realEl.tagName == "SCRIPT" ? "javascript" : "html";
  //var editor = createEditor(t,innerHTML,"text/"+ type);
  overlay.scrollTop = selected.offsetTop;
  app.codeMirrorEditor(innerHTML, type)
    .then(res => {
      if (res != innerHTML)
        app.core.htmlMatch.innerHTML(realEl, res);
    }, e => console.error(e))
    .finally(() => {
      if (ul) {
        ul.remove();
        var target = selected.querySelector(".html-tree-builder__caret");
        selected.classList.remove("open");
        treeBuilder.openTree({target});
        overlay.scrollTop = selected.offsetTop;
      }
    })
}
function editOuterHtml() {
  var t = document.createElement("div");
  var ul = selected.querySelector("ul");
  var realEl = selected["__html-tree-builder-el"];
  var outerHTML = realEl.outerHTML;
  //selected.replaceWith(t);
  overlay.scrollTop = t.offsetTop;
  app.codeMirrorEditor(outerHTML, "html")
    .then(value => {
      if (value != outerHTML)
        app.core.htmlMatch.outerHTML(realEl, value);
    }, e => console.error(e))
    .finally(() => {
      if (ul) {
        ul.remove();
        var target = selected.querySelector(".html-tree-builder__caret");
        selected.classList.remove("open");
        treeBuilder.openTree({target});
        overlay.scrollTop = selected.offsetTop;
      }
    })
}
const dragList = __dragList(overlay, {
  convalidateStart: function (el, originalEl) {
    if (originalEl.closest("[contenteditable]"))
      return;
    var selectedEl = selected ? selected["__html-tree-builder-el"] : null;
    var targetEl = el["__html-tree-builder-el"];
    if (treeBuilder.multiselected.length && targetEl &&
      treeBuilder.multiselected.find(n => n.el == targetEl)) {
      return {multiselection: treeBuilder.multiselected.map(v => v.listEl).sort((a, b) => a.offsetTop - b.offsetTop)}
    }
    if (selectedEl &&
      selectedIsMatch &&
      targetEl &&
      el == selected &&
      !selectedEl.nodeName.match(/(HTML|HEAD|BODY)$/) &&
      !targetEl.nodeName.match(/(HTML|HEAD|BODY)$/))
      return true
  },
  convalidate: function (el) {
    var selectedEl = selected ? selected["__html-tree-builder-el"] : null;
    var targetEl = el["__html-tree-builder-el"];
    var targetElMatch = targetEl && app.core.htmlMatch.find(targetEl);
    if (targetElMatch &&
      selectedEl &&
      selectedIsMatch &&
      targetEl &&
      selectedEl != targetEl &&
      !selectedEl.contains(targetEl) &&
      !selectedEl.nodeName.match(/(HTML|HEAD|BODY)$/) &&
      !targetEl.nodeName.match(/(HTML|HEAD|BODY)$/) &&
      el.parentNode != overlay.children[0] &&
      el.parentNode != overlay)
      return true;
  },
  handlerSelector: ".html-tree-build-dragger"
});
dragList.on("move", e => {
  var nodes = e.target;
  var prevEl = e.prev && e.prev["__html-tree-builder-el"];
  var prevFound = prevEl && app.core.htmlMatch.find(prevEl);
  if (prevFound) {
    for (var i = nodes.length - 1; i >= 0; i--) {
      app.core.htmlMatch.move(prevEl,
        nodes[i]["__html-tree-builder-el"],
        "after");
    }
  } else {
    for (var i = 0; i < nodes.length; i++) {
      app.core.htmlMatch.move(e.next["__html-tree-builder-el"],
        nodes[i]["__html-tree-builder-el"],
        "before");
    }
  }
})
// pivotEl for css/js view TODO remove
function pasteEl(pivotEl, insertionMode) {
  var els = treeBuilder.multiselection ? treeBuilder.multiselected : [{el: selected["__html-tree-builder-el"]}];
  var copyElements = cut || copy;
  //isPasteEvent = !(!!pivotEl);
  copyElements.sort((a, b) => a.listEl.offsetTop - b.listEl.offsetTop).forEach(n => {
    var toAppend = n.el;
    /*
    if(cut && toAppend.contains(el)){
        console.warn("pasteEl - trying to put an element inside itself");
        return;
    }*/
    els.forEach(multiObj => {
      /*
       if(el.tagName.match(app.utils.notEditableTags)){
       console.warn("pasteEl - trying to put elements inside a void element");
       return;
       }*/
      /*
       if(copy)
       toAppend = toAppend.cloneNode(true);
       app.core.htmlMatch[insertionMode || app.insertionMode](multiObj.el, toAppend, !(!!copy));*/
      var newEl = toAppend.cloneNode(true);
      app.core.htmlMatch[insertionMode || app.insertionMode](multiObj.el, newEl);
      if (cut)
        app.core.htmlMatch.removeChild(toAppend);
    })
  });
  /*
  copyElements.forEach(n => n.listEl.classList.remove("cutted,copied"));
  cut = null;
  copy = null;*/
}
function saveStylesheet(){
  var configDialog = opener.confirmDialog(`This action will save the stylesheet in the version parsed and compiled by the browser.
This means that comments and properties not recognized by this browser will be deleted.
Property values can be changed.
Also, if this stylesheet contains rules that have been previously edited, manipulating the document history could result in errors or unexpected changes.
Continue?`);
  configDialog.events.on("confirm",()=>{
    app.core.saveStyleSheet();
  });
}
addStyleSheetButton.addEventListener("click", e => {
  var isFormAlreadyInDialog = cssViewDOM.ownerDocument.getElementById("add-stylesheet-form");
  var template = isFormAlreadyInDialog ? null :
    cssViewDOM.ownerDocument.importNode(addStylesheetModal.content, true);
  var form = isFormAlreadyInDialog || template.children[0];
  stylesheetTagSelect = isFormAlreadyInDialog ? stylesheetTagSelect :
    template.querySelector("#add-stylesheet-tag");
  stylesheetTagSelect.addEventListener("change", stylesheetTagChange);
  form.addEventListener("submit", createNewStylesheet);
  var d = dialog.open(template);
  d.events.on("close", () => {
    form.removeEventListener("submit", createNewStylesheet);
    stylesheetTagSelect.removeEventListener("change", stylesheetTagChange);
  });
});

function stylesheetTagChange(e) {
  var v = e.target.value;
  overlay.ownerDocument.getElementById("add-stylesheet-href-field").style.display =
    v != "link" ? "none" : "block";
}
async function createNewStylesheet(e) {
  e.preventDefault();
  var newTagName = e.target["add-stylesheet-tag"].value;
  var newTag = app.core.currentDocument.createElement(newTagName);
  var isCurrent = e.target["add-stylesheet-current"].checked;
  if (newTagName == "link") {
    newTag.rel = "stylesheet";
    var href = e.target["add-stylesheet-href"].value.trim();
    opener.dialog.open("loading stylesheet...", true);
    app.core.fetchingStylesheet(href).then(async () => {
      newTag.href = href;
      await closeDialogNewStylesheet(newTag, isCurrent);
    }, err => {
      if (err.status && err.status == 404 &&
        !href.match(app.utils.URLIsAbsolute) &&
        href.endsWith('.css') &&
        app.storageInterface) {
        newTag.href = href;
        app.storageInterface.update(new URL(href, app.core.currentWindow.location.href).pathname
          .replace(encodeURI(app.utils.paddingURL(app.frameResourcePath())),""), new Blob([""]))
          .then(async () => {
            await closeDialogNewStylesheet(newTag, isCurrent)
          }, err => {
            opener.dialog.close();
            console.error("[error in creating path" + newTag.href + "]", err);
            opener.dialog.open("creating stylesheet error");
          })
      } else {
        console.log("[fetch stylesheet " + newTag.href + " error]", err);
        opener.dialog.close();
        opener.dialog.open("loading stylesheet error");
      }
    })
  } else await closeDialogNewStylesheet(newTag, isCurrent);
}

async function closeDialogNewStylesheet(newTag, isCurrent) {
  var insertionMode = app.insertionMode == "prepend" ?
    "before" :
    app.insertionMode == "append" ?
      "after" :
      app.insertionMode;
  if (selectedJsCSS)
    app.core.htmlMatch[insertionMode](selectedJsCSS["__html-tree-builder-el"],
      newTag);
  else
    app.core.htmlMatch.append(app.core.currentDocument.head, newTag);
  selectedJsCSS = {"__html-tree-builder-el": newTag};
  if (isCurrent)
    await app.core.setCurrentStyleSheet(newTag);
  opener.dialog.close();
  dialog.close();
}
function handleCssTooltip(li, e) {
  var el = li["__html-tree-builder-el"];
  var notDisplay = [];
  if (li.classList.contains("not-match"))
    notDisplay = [1, 2, 3];
  if (el.sheet == app.core.currentStyleSheet)
    notDisplay.push(2);
  else
    notDisplay.push(4);
  var sameDomain = el.tagName == "STYLE" ||
    (el.tagName == "LINK" &&
      el.getAttribute("href") &&
      !el.getAttribute("href").match(/^(http:\/\/)|^(https:\/\/)/));
  if (!sameDomain || (el.tagName == "LINK" && !app.storageInterface))
    notDisplay.push(3,4);
  [...cssViewTooltip.children].forEach((v, i) =>
    v.style.display = notDisplay.indexOf(i) > -1 ? "none" : "block");
  tooltip(e, cssViewTooltip);
}
function cssJsView(tagSelector, DOMContainer, DOMlist) {
  var tags = app.core.currentDocument.querySelectorAll(tagSelector);
  DOMlist.innerHTML = "";
  var frag = DOMContainer.ownerDocument.createDocumentFragment();
  var updateSelectCss;
  [...tags].forEach(obj => {
    treeBuilder.treeBuilder(obj, frag, DOMContainer);
    var el = frag.lastElementChild;
    var elMatch = app.core.htmlMatch.find(el["__html-tree-builder-el"]);
    if (!elMatch)
      el.classList.add("not-match");
    if (multiSelectionJsCss) {
      var findInMultiSelection = multiSelectionJsCss.find(v => v.el == obj);
      if (findInMultiSelection) {
        findInMultiSelection.listEl = el;
        el.classList.add("html-tree-builder__highlight");
      }
    }
    if (selectedJsCSS && selectedJsCSS["__html-tree-builder-el"] == el["__html-tree-builder-el"]) {
      selectedJsCSS = el;
      el.classList.add("html-tree-builder__highlight");
      app.core.selectElement(el["__html-tree-builder-el"]);
      //app.elementSelected = el["__html-tree-builder-el"];
    }
  });
  DOMlist.appendChild(frag);
  /*
    updateSelectCss && updateSelectCss.click();
    if(!updateSelectCss && selectedJsCSS)
        selectedJsCSS = null;
        */
}
function createEditorCssJs(src, value, mode, originalElement) {
  app.codeMirrorEditor(value, mode)
    .then(res => {
      if (src) {
        app.storageInterface.update(src, new Blob([res]))
          .then(ok => {
              var newElement = originalElement.cloneNode();
              app.core.htmlMatch.replaceWith(originalElement, newElement)
              selectedJsCSS = {"__html-tree-builder-el": newElement};
            },
            err => {
              console.error("[update resource error]", err);
              opener.alertDialog("update resource error")
            })
      } else {
        var newScript = originalElement.cloneNode();
        newScript.innerHTML = res;
        app.core.htmlMatch.replaceWith(originalElement, newScript);
        selectedJsCSS = {"__html-tree-builder-el": newScript};
      }
    }, e => console.error(e));
}
function cssJsMove(DOMList) {
  var dragList = __dragList(DOMList, {
    convalidateStart: function (el) {
      console.log(multiSelectionJsCss.find(v => v.listEl == el),);
      if (app.multiselected && multiSelectionJsCss.find(v => v.listEl == el)) {
        return {multiselection: multiSelectionJsCss.map(v => v.listEl).sort((a, b) => a.offsetTop - b.offsetTop)}
      }
      if (el == selectedJsCSS)
        return true
    },
    convalidate: function (el) {
      if (!el.classList.contains("not-match"))
        return true;
    },
    handlerSelector: ".html-tree-build-dragger"
  });
  dragList.on("move", e => {
    var nodes = e.target;
    var prevEl = e.prev && e.prev["__html-tree-builder-el"];
    var prevFound = prevEl && app.core.htmlMatch.find(prevEl);
    if (prevFound) {
      for (var i = nodes.length - 1; i >= 0; i--) {
        app.core.htmlMatch.move(prevEl,
          nodes[i]["__html-tree-builder-el"],
          "after");
      }
    } else {
      for (var i = 0; i < nodes.length; i++) {
        app.core.htmlMatch.move(e.next["__html-tree-builder-el"],
          nodes[i]["__html-tree-builder-el"],
          "before");
      }
    }
  });
  return dragList;
}
function cssJsKeyDown(DOMlist) {
  DOMlist.addEventListener("keydown", e => {
    if (e.key == "Delete" && selectedJsCSS) {
      autoInsertionJsCss = true;
      if (treeBuilder.multiselection)
        multiSelectionJsCss.forEach(mc => delEl(mc.el, mc.listEl, false));
      else
        delEl(selectedJsCSS["__html-tree-builder-el"], selectedJsCSS, false);
      selectedJsCSS = null;
      selected = null;
      app.core.deselectElement();
    }
  });
}
function onListClick(DOMlist, tooltip, handleTooltipFunction) {
  DOMlist.addEventListener("click", e => {
    var li = e.target.closest("li");
    if (!li) return;
    var multiSelected = app.multiselected;
    // activate tooltip
    if (e.target.closest(".menu-toggle")) {
      if (multiSelected && selectedJsCSS != li)
        selectedJsCSS = li;
      if (tooltip.style.display != "block")
        handleTooltipFunction(li, e);
      return;
    }
    if (e.target.closest(".menu-toggle-wrapper"))
      return;
    if (li.classList.contains("not-match")) return;
    var multiSelectionIndex = multiSelectionJsCss.findIndex(v => v.listEl == li);
    if (selectedJsCSS && selectedJsCSS == li) {
      if (multiSelected) {
        multiSelectionJsCss.splice(multiSelectionIndex, 1);
        li.classList.remove("html-tree-builder__highlight");
        selectedJsCSS = multiSelectionJsCss.length ? multiSelectionJsCss[multiSelectionJsCss.length - 1] : null;
      }
      return;
    } else if (multiSelectionIndex > -1) {
      multiSelectionJsCss.splice(multiSelectionIndex, 1);
      li.classList.remove("html-tree-builder__highlight");
      return;
    }
    li.classList.add("html-tree-builder__highlight");
    var treeBuilderElement = li.querySelector(".html-tree-builder__tag");
    var toggleWrapper = li.querySelector(".menu-toggle-wrapper");
    toggleWrapper.style.height = treeBuilderElement.offsetHeight + "px";
    multiSelected && multiSelectionJsCss.push({listEl: li, el: li["__html-tree-builder-el"]});
    selectedJsCSS &&
    selectedJsCSS instanceof HTMLElement &&
    selectedJsCSS != li &&
    !multiSelected &&
    selectedJsCSS.classList.remove("html-tree-builder__highlight");
    selectedJsCSS = li;
    var DOMelement = li["__html-tree-builder-el"];
    selectedJsCSSMatch = app.core.htmlMatch.find(DOMelement);
    app.core.selectElement(DOMelement, selectedJsCSSMatch);
  });
}
function cssJsTooltipEvent(tooltipEl) {
  tooltipEl.addEventListener("click", e => {
    var actionName = e.target.dataset.name;
    if (!actionName) return;
    switch (actionName) {
      case "reveal":
        selectedTab.click();
        break;
      case "remove-element":
        autoInsertionJsCss = true;
        if (treeBuilder.multiselection)
          multiSelectionJsCss.forEach(mc => delEl(mc.el, mc.listEl, false));
        else
          delEl(selectedJsCSS["__html-tree-builder-el"], selectedJsCSS, false);
        selectedJsCSS = null;
        selected = null;
        app.core.deselectElement();
        break;
      case "edit":
        var sel = selectedJsCSS["__html-tree-builder-el"];
        var mode = sel.tagName == "SCRIPT" ? "js" : "css";
        var valueFetch = (sel.tagName == "SCRIPT" && sel.src) || (sel.tagName == "LINK" && sel.href);
        if (valueFetch) {
          var src = sel.tagName == "SCRIPT" ? sel.getAttribute("src") : sel.getAttribute("href");
          var srcParsed = src[0] == "/" ? encodeURI(app.utils.paddingURL(app.frameResourcePath())) + src.substring(1) : src;
          var urlToFetch = new URL(srcParsed, app.core.currentWindow.location.href)
          fetch(urlToFetch)
            .then(res => {
              if (res.status == 200) {
                return res.text();
              } else {
                console.error("[trying edit, resource status not 200]", res);
                opener.alertDialog("fail to edit, resource status not 200", true);
                return false;
              }
            }, err => {
              dialog.close();
              console.error("[trying edit, network error]", err);
              opener.alertDialog("fail to edit, network error]", true)
            })
            .then(value => {
              if(value !== false)
                createEditorCssJs(urlToFetch.pathname.replace(encodeURI(app.utils.paddingURL(app.frameResourcePath())),""), value, mode, sel)
            })
        } else createEditorCssJs("", sel.tagName == "SCRIPT" ?
          sel.innerHTML :
          [...sel.sheet.cssRules].map(v => v.cssText).join("\n"), mode, sel);
        break;
      case "set-as-current":
        app.core.setCurrentStyleSheet(selectedJsCSS["__html-tree-builder-el"]);
        break;
      case "save":
        saveStylesheet();
    }
    tooltipEl.style.display = "none";
  });
}
cssViewTooltip.addEventListener("blur", e => {
  cssViewTooltip.style.display = "none"
});
jsViewTooltip.addEventListener("blur", e => {
  jsViewTooltip.style.display = "none"
});

function cssJsViewCM(e, handleTooltipFunc) {
  var li = e.target.closest("li");
  if (!li) return;
  selectedJsCSS != li && li.click();
  e.preventDefault();
  handleTooltipFunc(li, e);
}

cssViewDOMList.addEventListener("contextmenu", e => cssJsViewCM(e, handleCssTooltip));
jsViewDOMList.addEventListener("contextmenu", e => cssJsViewCM(e, handleJsTooltip));
addScriptButton.addEventListener("click", e => {
  var isFormAlreadyInDialog = jsViewDOM.ownerDocument.getElementById("add-script-form");
  var template = isFormAlreadyInDialog ? null :
    jsViewDOM.ownerDocument.importNode(addScriptModal.content, true);
  var form = isFormAlreadyInDialog || template.children[0];
  form.addEventListener("submit", createNewScript);
  var d = dialog.open(template);
  d.events.on("close", () => {
    form.removeEventListener("submit", createNewScript);
  });
});
function createNewScript(e) {
  e.preventDefault();
  var newTag = app.core.currentDocument.createElement("script");
  if (e.target["add-script-src-enable"].checked) {
    var src = e.target["add-script-src"].value.trim();
    opener.dialog.open("loading script...", true);
    newTag.src = src;
    var urlToFetch;
    if(!src.match(app.utils.URLIsAbsolute)) {
      var srcParsed = src[0] == "/" ? encodeURI(app.utils.paddingURL(app.frameResourcePath())) + src.substring(1) : src;
      urlToFetch = new URL(srcParsed, app.core.currentWindow.location.href);
    }
    else urlToFetch = src;
    fetch(urlToFetch).then(res => {
      if (res.status == 200) {
        closeDialogNewScript(newTag);
      } else if (res.status &&
        res.status == 404 &&
        !src.match(app.utils.URLIsAbsolute) &&
        src.endsWith('.js') &&
        app.storageInterface) {
        app.storageInterface.update(urlToFetch.pathname
          .replace(encodeURI(app.utils.paddingURL(app.frameResourcePath())),""), new Blob([""]))
          .then(() => {
            opener.dialog.close();
            closeDialogNewScript(newTag)
          }, err => {
            opener.dialog.close();
            console.error("[error in creating path" + src + "]", err);
            opener.dialog.open("creating script error");
          })
      } else {
        console.log("[fetch script " + newTag.src + " error]", res);
        opener.dialog.close();
        opener.dialog.open("fetch script error, maybe app.storageInterface not setted");
      }
    }, err => {
      console.log("[fetch script " + newTag.src + " error]", err);
      opener.dialog.close();
      opener.dialog.open("fetch script error");
    })
  } else closeDialogNewScript(newTag);
}

function closeDialogNewScript(newTag) {
  var insertionMode = app.insertionMode == "prepend" ?
    "before" :
    app.insertionMode == "append" ?
      "after" :
      app.insertionMode;
  if (selectedJsCSS)
    app.core.htmlMatch[insertionMode](selectedJsCSS["__html-tree-builder-el"],
      newTag);
  else
    app.core.htmlMatch.append(app.core.currentDocument.body, newTag);
  selectedJsCSS = {"__html-tree-builder-el": newTag};
  dialog.close();
  opener.dialog.close();
}
function handleJsTooltip(li, e) {
  var el = li["__html-tree-builder-el"];
  var notDisplay = [];
  if (li.classList.contains("not-match"))
    notDisplay = [1, 2];
  var sameDomain = !el.src || (el.tagName == "SCRIPT" && el.src
    && !el.getAttribute("src").match(/^(http:\/\/)|^(https:\/\/)/));
  if (!sameDomain || (el.src && !app.storageInterface))
    notDisplay.push(3);
  [...jsViewTooltip.children].forEach((v, i) =>
    v.style.display = notDisplay.indexOf(i) > -1 ? "none" : "block");
  tooltip(e, jsViewTooltip);
}
let selectedTab = null;
[...menuBarTabs].forEach(mbt => mbt.addEventListener("click", e => {
  var target = e.target;
  var doc = target.getRootNode();
  var isSelected = target.classList.toggle("selected");
  if (selectedTab && selectedTab != target) {
    selectedTab.classList.remove("selected");
    doc.querySelector(selectedTab.getAttribute("href")).style.display = "none";
  }
  var cacheSel = selectedJsCSS && selectedJsCSS["__html-tree-builder-el"];
  multiSelectionJsCss = [];
  selectedJsCSS = null;
  var href = e.target.getAttribute("href");
  if (isSelected) {
    if (app.multiselected) {
      app.multiselections.slice(0).forEach((v, i) => {
        internalMultiremove = true;
        app.removeItemSelected()
      });
      treeBuilder.removeMultiSelection();
    } else
      app.core.deselectElement();
    if (searchTrigger.classList.contains("opened"))
      searchTrigger.click();
    selectedTab = e.target;
    doc.querySelector(href).style.display = "block";
    overlay.style.display = "none";
    switch (href) {
      case "#css-view":
        cssJsView("link[rel=stylesheet],style", cssViewDOM, cssViewDOMList);
        break;
      case "#js-view":
        cssJsView("script", jsViewDOM, jsViewDOMList);
    }
  } else {
    if (app.multiselected) {
      app.multiselections.slice(0).forEach((v, i) => {
        internalMultiremove = true;
        app.removeItemSelected()
      });
      treeBuilder.activateMultiSelection();
    }
    selectedTab = null;
    doc.querySelector(href).style.display = "none";
    overlay.style.display = "block";
    if (!app.elementSelected || app.elementSelected != cacheSel)
      app.core.currentDocument.documentElement.contains(cacheSel) &&
      app.core.selectElement(cacheSel)
    else if (cacheSel) {
      selected = treeBuilder.highlightElement(cacheSel);
      toMatch();
    }
  }
}));
function handleClick(e) {
  selected = e.detail.selected;
  var sourceTarget = selected["__html-tree-builder-el"];
  var multiselected = e.detail.multiselection ? treeBuilder.multiselected : false;
  var match = toMatch(e.detail.match);
  if (!match && multiselected) {
    treeBuilder.removeItemSelected();
    return;
  }
  if (!match)
    selected.classList.add("not-match");
  else
    selected.classList.remove("not-match");
  var toHighlightTarget = sourceTarget.nodeType == 3 ? sourceTarget.parentNode : sourceTarget;
  app.core.selectElement(sourceTarget, selectedIsMatch);
  if (match && app.editMode == "selection" && app.elementSelected != toHighlightTarget) {
    if (app.lastEditable && !app.lastEditable.el.contains(toHighlightTarget)) {
      app.lastEditable.destroy();
    } else if (app.contenteditable && !app.lastEditable && !multiselected) {
      app.core.contenteditable(toHighlightTarget);
    }
    //else if(!app.contenteditable)
    //app.core.setSelection();
    //app.core.translateHighlight(sourceTarget,app.editElements.selection);
  }
  //app.elementSelected = sourceTarget;
  opener.dispatchEvent(new Event("element-selected"));
}
function contextMenu(e) {
  if (e.target.closest(".CodeMirror"))
    return;
  e.preventDefault();
  tooltipEl.style.display = "none";
  var target = e.target.closest(".html-tree-builder-el");
  if (!target) // codeMirror
    return;
  var isHighlighted = target.classList.contains("html-tree-builder__highlight");
  !isHighlighted && target.click();
  tooltipHandle({target: e.target});
  !tooltipElHide && tooltip(e);
}
function copyEl(elementsToCopy) {
  var clipboard = copy || cut;
  clipboard && clipboard.forEach(n => n.listEl.classList.remove("cutted", "copied"));
  copy = elementsToCopy ||
    (treeBuilder.multiselection ? treeBuilder.multiselected.slice(0) : [{
      el: selected["__html-tree-builder-el"],
      listEl: selected
    }]);
  copy.forEach(n => n.listEl.classList.add("copied"));
  cut = null;
  // clear multiselection
  //treeBuilder.clearMultiSelection();
  // elementsToCopy means a call from css/js view. We disable multiselection in this case.
  if(treeBuilder.multiselection) {
      multiselectButton.click();
      //app.core.deselectElement();
  }
}
function cutEl(elementsToCut) {
  var clipboard = copy || cut;
  clipboard && clipboard.forEach(n => n.listEl.classList.remove("cutted", "copied"));
  cut = elementsToCut ||
    (treeBuilder.multiselection ? treeBuilder.multiselected.slice(0) : [{
      el: selected["__html-tree-builder-el"],
      listEl: selected
    }]);
  cut.forEach(n => n.listEl.classList.add("cutted"));
  copy = null;
  // clear multiselection
  //treeBuilder.clearMultiSelection(); // problem with selected
  // elementsToCopy means a call from css/js view. We disable multiselection in this case.
    if(treeBuilder.multiselection) {
        multiselectButton.click();
        //app.core.deselectElement();
    }
}
function dblclick(e) {
  if (!selected || !selected.contains(e.target))
    return;
  if (!selectedIsMatch)
    return;
  //var found = app.core.htmlMatch.find(selected["__html-tree-builder-el"]);
  /*
  (!found) // no match
      return;
   */
  // attributes
  var sp = e.target.closest(".html-tree-builder-attribute");
  if (sp && selectedIsMatch.attributes) {
    var tg = e.target != sp ?
      e.target :
      sp.querySelector(".attribute-value") || sp.querySelector(".attribute-key");
    activateAttributeContentEditable(sp, tg);
  }
  // text
  if (selected["__html-tree-builder-el"].nodeType == 3 && selectedIsMatch.HTML) {
    activateTextNodeContentEditable();
  }
}
function onKeyDown(e) {
  if (!e.target)
    return;
  if (e.target.closest("[contenteditable]"))
    return;
  if (e.target.closest(".CodeMirror"))
    return;
  if (tooltipEl.contains(e.target)) {
    tooltipKeyEvents(e);
    return;
  }
  var multiselection = treeBuilder.multiselection;
  if (e.key == "ArrowUp") {
    e.preventDefault();
    if (multiselection)
      multiselectButton.click();
    var previous = selected && (selected.previousElementSibling ||
      (selected.parentNode && selected.parentNode.closest("li")));
    if (previous) {
      if (!isElementInViewport(previous))
        previous.scrollIntoView();
      previous.click();
    }
  }
  if (e.key == "ArrowDown") {
    e.preventDefault();
    if (multiselection)
      multiselectButton.click();
    var next;
    if (selected) {
      if (selected.nextElementSibling) next = selected.nextElementSibling;
      else {
        var hasChildrenOpen = selected.querySelector("li");
        if (hasChildrenOpen)
          next = hasChildrenOpen;
        else {
          var closest = selected.closest("li");
          next = closest && closest.nextElementSibling
        }
      }
    }
    if (next) {
      if (!isElementInViewport(next))
        next.scrollIntoView();
      next.click();
    }
    return;
  }
  if ((e.key == "ArrowLeft" || e.key == "ArrowRight") && selected)
    treeBuilder.openTree({target: selected});
  if (!selectedIsMatch)
    return;
  if (e.key == "Delete" && selected) {
    deleteEl();
    return;
  }
  if (selected && e.key == "Enter") {
    var isMenuToggle = e.target.closest(".menu-toggle");
    if (isMenuToggle)
      return;
    if (e.target.classList.contains("html-tree-builder-attribute") ||
      e.target.classList.contains("html-tree-builder-node-value"))
      return;
    e.preventDefault();
    var attr = selected.querySelector(".html-tree-builder-attribute");
    if (attr && attr.parentNode.parentNode == selected && selectedIsMatch.attributes) {
      var span = attr.querySelector(".attribute-value") || attr.querySelector(".attribute-key");
      activateAttributeContentEditable(attr, span);
      return;
    }
    // text
    if (selected["__html-tree-builder-el"].nodeType == 3 && selectedIsMatch.HTML) {
      activateTextNodeContentEditable();
      return;
    }
  }
  if (e.ctrlKey||e.metaKey) {
    switch (e.key) {
      case "c":
      case "C":
        e.preventDefault();
        selected && copyEl();
        break;
      case "x":
      case "X":
        e.preventDefault();
        selected && cutEl();
        break;
      case "v":
      case "V":
        e.preventDefault();
        if (!cut && !copy)
          return;
        selected && pasteEl();
        break;
    }
  }
}
function mutation(e) {
  if (isAutoInsertionFlag) {
    isAutoInsertionFlag = false;
    return;
  }
  var ml = e.detail.mutationList;
  var attr = [];
  var childs = [];
  var scriptMutation, cssMutation;
  ml.forEach(m => {
    if (m.type == "attributes") {
      if (attr.indexOf(m.target) < 0)
        attr.push(m.target)
    }
    if (m.type == "childList") {
      if (childs.indexOf(m.target) < 0)
        childs.push(m.target);
      scriptMutation = scriptMutation || [...m.addedNodes].concat([...m.removedNodes]).find(v => v.tagName == "SCRIPT");
      cssMutation = cssMutation || [...m.addedNodes].concat([...m.removedNodes]).find(v =>
        (v.tagName == "LINK" && v.rel.toLowerCase() == "stylesheet") ||
        v.tagName == "STYLE");
    }
    if (m.type == "characterData") {
      if (childs.indexOf(m.target.parentNode) < 0)
        childs.push(m.target.parentNode)
    }
    var targetTagName = m.target.tagName;
    if (
      (targetTagName == "LINK" && m.target.rel.toLowerCase() == "stylesheet") ||
      targetTagName == "STYLE"
    )
      cssMutation = true;
    if (targetTagName == "SCRIPT")
      scriptMutation = true;
  });
  attr.forEach(a => {
    var el = treeBuilder.isInView(a);
    if (el) {
      var attributes = el.querySelector(".html-tree-builder-attributes");
      attributes.outerHTML = treeBuilder.createAttributes(a.attributes);
    }
  });
  childs.forEach(c => {
    var el = treeBuilder.isInView(c);
    if (!el)
      return;
    var target = el.querySelector(".html-tree-builder__caret");
    if (!target) {
      el.querySelector(".html-tree-builder-element")
        .insertAdjacentHTML('beforeend', '<span class="html-tree-builder__caret"></span>');
      return;
    }
    var ul = el.querySelector("ul");
    ul && ul.remove();
    el.classList.remove("open");
    target && treeBuilder.openTree({target});
  });
  /*
  if(isPasteEvent){
      var className = cut ? "cutted":"copied";
      var clipboard = cut || copy;
      clipboard = clipboard.map(n=>{
          var newTarget = treeBuilder.highlightElement(n.el,false);
          newTarget.classList.add(className);
          return{listEl:newTarget,el:n.el}
      });
      if(cut)
          cut = clipboard;
      else copy = clipboard;
      isPasteEvent = false;
  }*/
  if (cssMutation && cssViewDOM.style.display == "block") {
    if (autoInsertionJsCss)
      autoInsertionJsCss = false;
    else
      cssJsView("link[rel=stylesheet],style", cssViewDOM, cssViewDOMList);
  }
  if (scriptMutation && jsViewDOM.style.display == "block")
    if (autoInsertionJsCss)
      autoInsertionJsCss = false;
    else
      cssJsView("script", jsViewDOM, jsViewDOMList);
  var mutateSelections =
    treeBuilder.multiselection ? treeBuilder.multiselected :
      selected ? [{el: selected["__html-tree-builder-el"], listEl: selected}] : [];
  mutateSelections.forEach((v, i) => {
    if (!app.core.currentDocument.documentElement.contains(v.el)) {
      if (!treeBuilder.multiselection) {
        selected = null;
        treeBuilder.deSelect();
      } else {
        treeBuilder.removeItemSelected(i);
        opener.dispatchEvent(
          new CustomEvent("html-tree-remove-multiselection", {detail: {el}})
        );
      }
      return;
    }
    var isInView = treeBuilder.isInView(v.el)
    if (!isInView)
      isInView = treeBuilder.highlightElement(v.el);
    if (isInView != v.listEl) {
      if (selected == v.listEl) {
        selected = isInView;
        treeBuilder.selected = isInView;
      }
      v.listEl = isInView;
      v.listEl.classList.add("html-tree-builder__highlight");
    }
  })
  if(app.elementSelected && selected && selected["__html-tree-builder-el"] != app.elementSelected){
      treeBuilder.highlightElement(app.elementSelected);
  }
  /*
  /*
  if(app.elementSelected && app.core.currentDocument.contains(app.elementSelected)){
      treeBuilder.highlightElement(app.elementSelected);
  }
  else if(app.elementSelected && !app.core.currentDocument.contains(app.elementSelected)){
      app.core.deselectElement();
  }*/
}
tooltipEl.addEventListener("click", e => {
  var target = e.target.closest("[data-name]");
  if (!target)
    return;
  var nameAction = target.dataset.name;
  if (!nameAction)
    return;
  switch (nameAction) {
    case "add-attribute":
      addAttribute();
      break;
    case "edit-attribute":
      dblclick({target: attributeSelected});
      break;
    case "edit-inner-html":
      editInnerHtml();
      break;
    case "edit-outer-html":
      editOuterHtml();
      break;
    case "delete-element":
      deleteEl();
      break;
    case "cut-element":
      cutEl();
      break;
    case "copy-element":
      copyEl();
      break;
    case "paste-element":
      pasteEl();
      break;
    case "expand-recursively":
      treeBuilder.expandRecursively();
      overlay.scrollTop = selected.offsetTop;
      break;
    case "collapse-children":
      treeBuilder.collapseChildren();
      break;
    case "scroll-into-view":
      selected["__html-tree-builder-el"].scrollIntoView(false);
      break;
    case "set-as-current-stylesheet":
      app.core.setCurrentStyleSheet(selected["__html-tree-builder-el"]);
      break;
    case "save":
      saveStylesheet();
  }
  tooltipEl.style.display = "none";
});
function tooltipHandle(e) {
  var el = selected["__html-tree-builder-el"];
  if (!selectedIsMatch) {
    tooltipEl.style.display = "none";
    tooltipElHide = true;
    return;
  }
    /* :after,:before disable options */
  /*
  if(e.detail.pseudo){
      enableTooltipActions(["scroll-into-view"]);
  }
  */
  else {
    tooltipElHide = false;
    var nodeType = el.nodeType;
    if (nodeType == 1 && !el.nodeName.match(/(HEAD|BODY|HTML)$/)) {
      var toDisable = [];
      /* attributes tooltip edit handle */
      if (!selectedIsMatch.attributes)
        toDisable.push("edit-attribute", "add-attribute");
      else {
        attributeSelected = e.target.closest(".html-tree-builder-attribute");
        !attributeSelected && toDisable.push("edit-attribute")
      }
      if (!selectedIsMatch.HTML)
        toDisable.push("edit-inner-html", "edit-outer-html", "cut-element", "copy-element");
      if(selectedIsMatch.HTML && !selectedIsMatch.attributes)
        toDisable.push("edit-outer-html");
      var canBeAStyle = (el.tagName === "STYLE" || el.tagName === "LINK") && el.sheet && el.sheet !== app.core.currentStyleSheet;
      if(!canBeAStyle)
        toDisable.push("set-as-current-stylesheet");
      if(el.sheet !== app.core.currentStyleSheet)
        toDisable.push("save");
      var clipboard = cut || copy;
      /*
      if(!clipboard ||
          clipboard.find(n=>n.listEl.contains(selected))
      )*/
      if (!clipboard || !selectedIsMatch.match)
        toDisable.push("paste-element");
      if (clipboard && clipboard.length > 1)
        tooltipEl.classList.add("multiselected");
      else
        tooltipEl.classList.remove("multiselected");
      enableTooltipActions(toDisable, true);
    }
    else if (nodeType == 3 || nodeType == 8) {
      enableTooltipActions(["delete-element", "cut-element", "copy-element", "scroll-into-view"]);
    } else if (el.nodeName.match(/(HEAD|BODY|HTML)$/)) {
      var toDisable = ["cut-element", "copy-element", "edit-outer-html", "delete-element","set-as-current-stylesheet","save"];
      if (!selectedIsMatch.HTML) {
        toDisable.push("edit-inner-html")
      }
      enableTooltipActions(toDisable, true);
    } else enableTooltipActions([]);
  }
}
function tooltipKeyEvents(e) {
  var sel = tooltipEl.querySelector(".selected");
  if (e.key == "ArrowUp" || e.key == "ArrowDown") {
    var multiselection = treeBuilder.multiselection;
    var root = multiselection ? multiselectionToolTip : tooltipEl;
    if (!sel)
      root.children[0].classList.add("selected");
    else {
      sel.classList.remove("selected");
      var next;
      if (e.key == "ArrowUp") {
        var previous = sel.previousElementSibling;
        while (previous && (previous.tagName != "DIV" || previous.hasAttribute("disabled")))
          previous = previous.previousElementSibling;
        next = previous || (
          multiselection ?
            multiselectionToolTip.children[multiselectionToolTip.children.length - 1] :
            tooltipEl.children[tooltipEl.children.length - 2]
        )
      } else {
        var nextS = sel.nextElementSibling;
        while (nextS && (nextS.tagName != "DIV" || nextS.hasAttribute("disabled")))
          nextS = nextS.nextElementSibling;
        next = nextS || root.children[0]
      }
      next.classList.add("selected");
    }
  }
  if (e.key == "Enter" && sel) {
    e.preventDefault();
    sel.click();
  }
}
function nextNode(node) {
  if (node.hasChildNodes())
    return node.firstChild;
  while (node && !node.nextSibling)
    node = node.parentNode;
  if (!node)
    return null;
  return node.nextSibling;
}

function getElementsInRange(startNode, endNode) {
  var nodes = [];
  var next = startNode;
  while (next) {
    nodes.push(next);
    if (next == endNode)
      break;
    next = nextNode(next, endNode);
  }
  return nodes;
}
multiselectButton.addEventListener("click", e => {
  if (multiselectButton.classList.toggle("selected")) {
    if (selected && (!selectedIsMatch || selected.nodeName.match(/(HTML|HEAD|BODY)$/))) {
      //treeBuilder.deSelect();
      app.core.deselectElement();
      selected = null;
    }
    treeBuilder.activateMultiSelection();
    app.enableMultiselection();
    if ((jsViewDOM.style.display == "block" || cssViewDOM.style.display == "block")
      && selectedJsCSS)
      multiSelectionJsCss.push({listEl: selectedJsCSS, el: selectedJsCSS["__html-tree-builder-el"]})
  } else {
    //treeBuilder.removeMultiSelection();
    //internalMultiremove = true;
    app.destroyMultiselection();
    treeBuilder.removeMultiSelection();
    multiSelectionJsCss.forEach(v => v != selectedJsCSS &&
      v.listEl.classList.remove("html-tree-builder__highlight"));
    multiSelectionJsCss = [];
  }
});
window.addEventListener("beforeunload", e => {
  if (app.multiselected)
    app.destroyMultiselection();
});
function multiselectionOnShiftKey(targetLI, match) {
  var multiselected = treeBuilder.multiselected;
  var lastNode = multiselected[multiselected.length - 1].listEl;
  app.multiselections.slice(0).forEach((v, i) => app.removeItemSelected());
  /*
  multiselected.forEach(v=>v.listEl.classList.remove("html-tree-builder__highlight"));
  treeBuilder.multiselected = [];
  app.multiselections.forEach(n=>n.highlight.remove());
  app.multiselections = [];
  app.elementSelected && app.core.deselectElement();*/
  treeBuilder.selected = null;
  selected = null;
  if (targetLI == lastNode)
    return;
  var arr = [lastNode, targetLI].sort((a, b) => a.offsetTop - b.offsetTop);
  var range = getElementsInRange(arr[0], arr[1]);
  var ms = [];
  range.forEach(n => {
    if (n == targetLI)
      return;
    var realNode = n["__html-tree-builder-el"];
    if (n.nodeName == "LI" && !ms.find(v => n.contains(v.listEl) || v.listEl.contains(n))
      && app.core.htmlMatch.find(realNode)) {
      app.core.selectElement(realNode);
      ms.push({listEl: n, el: realNode});
      /*
        n.classList.add("html-tree-builder__highlight");
        ms.push({listEl: n, el: realNode});
        treeBuilder.toggleClassListHighlight(n);
        app.createSelectionClone(realNode);
        */
    }
  });
  app.core.selectElement(targetLI["__html-tree-builder-el"]);
  //treeBuilder.selected = targetLI;
  //selectedIsMatch = match;
  //handleClick({detail:{selected:targetLI,multiselection:true}})
}
function changeSelection(index) {
  searchBarEntries.children[0].textContent = index + 1;
  var value = selections[index];
  if (value == currentSearchEl)
    return;
  currentSearchEl = value;
  app.core.selectElement(currentSearchEl);
  //currentSearchEl.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));
  /*
  if(currentSearchEl.nodeType == 1)
      treeBuilder.highlightElement(currentSearchEl);
  else
      treeBuilder.highlightElement(currentSearchEl.parentNode);
      */
}

searchBarUp.addEventListener("click", function (e) {
  if (e.target.disabled)
    return;
  pointer = pointer ? pointer - 1 : selections.length - 1;
  changeSelection(pointer)
});
searchBarDown.addEventListener("click", function (e) {
  if (e.target.disabled)
    return;
  pointer = pointer < selections.length - 1 ? pointer + 1 : 0;
  changeSelection(pointer)
});
searchBar.addEventListener("click", function (e) {
  if (e.target.nodeName != "BUTTON" ||
    e.target.parentNode != searchBar ||
    e.target == searchSelected)
    return;
  searchSelected.classList.remove("selected");
  e.target.classList.add("selected");
  searchSelected = e.target;
});
findButton.addEventListener("input", (e)=>{
  selectionText = findButton.value.trim();
  currentSearchEl = null;
  var doc = app.core.currentDocument;
  try {
    selections = doc.querySelectorAll(selectionText);
  }
  catch(e){
    selections = [];
  }
  searchBarEntries.children[0].textContent = selections.length ? "1" : "0";
  searchBarEntries.children[1].textContent = selections.length ? selections.length : "0";
  searchBarEntries.style.display = "block";
  searchBarDown.disabled = !selections.length;
  searchBarUp.disabled = !selections.length;
  selections.length && changeSelection(0);
})
let searchTrigger = document.getElementById("search-trigger");
searchTrigger.addEventListener("click", e => {
  searchTrigger.classList.toggle("opened");
  searchTrigger.classList.toggle("selected");
  var isOpened = searchBar.classList.toggle("opened");
  isOpened && selectedTab && selectedTab.click();
});
})();