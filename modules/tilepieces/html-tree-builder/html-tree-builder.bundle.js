(()=>{
HtmlTreeBuilder.prototype.collapseChildren = function () {
  var sel = this.selected;
  var carets = sel.querySelectorAll(".html-tree-builder__caret");
  [...carets].forEach(v=>{
    var closest = v.closest("li");
    closest != sel && closest?.classList.remove("open")
  });
}
let opener = window.opener || (window.parent || window);
// tree builder originally conceived as singleton ( as a simple function ).
// Later changed as constructor, however at the moment only one instance for document is supported.
// these below are the variables that are setted in constructor and shared among the functions
let htmlTreeBuilderTarget; // DOM target
let showEmptyNodes = null;
const voidElementsRegex = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;

function createAttributes(attrs) {
  var attrsTokens = [];
  var returnString = "";
  for (var i = 0; i < attrs.length; i++)
    attrsTokens[i] = `<span class="html-tree-builder-attribute" spellcheck="false">` +
      `<span class="attribute-key" data-key="${attrs[i].name}">${attrs[i].name}</span>` +
      `="<span class="attribute-value" data-value="${attrs[i].value}">${attrs[i].value}</span>"</span>`;

  returnString +=
    `<span class="html-tree-builder-attributes ${attrsTokens.length ? `` : `no-pad`}">
            ${attrsTokens.join("&nbsp;")}</span>`;
  return returnString;
}
function createDocType(el) {
  if (el.doctype) {
    var doctype = {
      name: el.doctype.name,
      publicId: el.doctype.publicId,
      systemId: el.doctype.systemId
    };
    var html = '<!DOCTYPE ' + doctype.name;
    if (doctype.publicId.length) html += ' PUBLIC "' + doctype.publicId + '"';
    if (doctype.systemId.length) html += ' "' + doctype.systemId + '"';
    html += ">";
    return html;
  }
  return "<!DOCTYPE html>";
}
function createDocumentRoot(el) {
  var html = htmlTreeBuilderTarget.ownerDocument.createDocumentFragment();
  // creating doctype
  var documentDeclarationDiv = htmlTreeBuilderTarget.ownerDocument.createElement("div");
  documentDeclarationDiv.className = "html-tree-builder__doctype";
  documentDeclarationDiv.textContent = createDocType(el);
  createMenuToggler(documentDeclarationDiv);
  html.appendChild(documentDeclarationDiv);
  // creating html tag
  var htmlDiv = htmlTreeBuilderTarget.ownerDocument.createElement("div");
  htmlDiv.innerHTML = createElementRepresentation(el.documentElement);
  htmlDiv.className = "html-tree-builder-element html-tree-builder-el";
  htmlDiv["__html-tree-builder-el"] = el.documentElement;
  html.appendChild(htmlDiv);
  // creating head, body
  var headUl = htmlTreeBuilderTarget.ownerDocument.createElement("ul");
  headUl.appendChild(treeBuilder(el.head));
  html.appendChild(headUl);
  // creating body tag
  var bodyUl = htmlTreeBuilderTarget.ownerDocument.createElement("ul");
  bodyUl.className = "html-tree-builder-body";
  bodyUl.appendChild(treeBuilder(el.body));
  html.appendChild(bodyUl);
  return html;
}
function createElementRepresentation(target) {
  var closure = target.nodeName.match(voidElementsRegex) ? "/&gt;" : "&gt;";
  var attrRepr = createAttributes(target.attributes);
  return `<span>&lt;</span><span class="html-tree-builer__tag-span">` +
    `${target.tagName.toLowerCase()}</span>${attrRepr}` +
    `<span class="html-tree-builer__tag-span">${closure}</span>`;
}
function createMenuToggler(div,noCreateDrag) {
  var divWrapper = document.createElement("div");
  divWrapper.className = "menu-toggle-wrapper"
  if(!noCreateDrag) {
    var dragToggler = document.createElement("span");
    dragToggler.className = "html-tree-build-dragger";
    dragToggler.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
<g>
	<g>
		<g>
			<path style="fill:#727272;" d="M17.5,8.4c-0.4,0-0.7-0.1-1-0.4L12,3.4L7.5,7.8C7,8.4,6.1,8.4,5.6,7.8C5,7.3,5,6.4,5.6,5.9L11,0.5
			c0.5-0.5,1.4-0.5,1.9,0L18.4,6C19,6.6,19,7.4,18.4,8C18.2,8.2,17.8,8.4,17.5,8.4z"/>
		</g>
		<g>
			<path style="fill:#727272;" d="M12,11c-0.8,0-1.4-0.6-1.4-1.4l0-8.2c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4l0,8.2
			C13.4,10.4,12.8,11,12,11z"/>
		</g>
	</g>
	<g>
		<g>
			<path style="fill:#727272;" d="M6.5,15.6c0.4,0,0.7,0.1,1,0.4l4.5,4.6l4.5-4.5c0.5-0.5,1.4-0.5,1.9,0c0.5,0.5,0.5,1.4,0,1.9
			L13,23.5c-0.5,0.5-1.4,0.5-1.9,0L5.6,18C5,17.4,5,16.6,5.6,16C5.8,15.8,6.2,15.6,6.5,15.6z"/>
		</g>
		<g>
			<path style="fill:#727272;" d="M12,13c0.8,0,1.4,0.6,1.4,1.4l0,8.2c0,0.8-0.6,1.4-1.4,1.4c-0.8,0-1.4-0.6-1.4-1.4l0-8.2
			C10.6,13.6,11.2,13,12,13z"/>
		</g>
	</g>
</g>
</svg>`;
    divWrapper.prepend(dragToggler);
  }
  var menuToggler = document.createElement("a");
  menuToggler.setAttribute("href", "javascript:void(0)");
  menuToggler.className = "menu-toggle";
  menuToggler.textContent = "..."
  divWrapper.prepend(menuToggler);
  div.prepend(divWrapper);
}
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function handleClick(e, $self) {
  if (e.target.classList.contains("html-tree-builder__caret"))
    return;
  if (e.target.closest(".menu-toggle-wrapper"))
    return;
  /* get target */
  var target = e.target.closest(".html-tree-builder-el");
  if ($self.preventDefaultClickOnMs && $self.preventDefaultClickOnMs(e, target))
    return;
  var multiselection = $self.multiselection;
  var multiselected = $self.multiselected;
  if (multiselection) {
    var multiSelectionIndex = $self.multiselected.findIndex(v => v.listEl == target);
    if (multiSelectionIndex > -1) {
      var el = $self.multiselected[multiSelectionIndex].el;
      $self.removeItemSelected(multiSelectionIndex);
      opener.dispatchEvent(
        new CustomEvent("html-tree-remove-multiselection", {
          detail: {
            el,
            index: multiSelectionIndex,
            target
          }
        })
      );
      return;
    }
  }
  if ($self.selected == target)
    return;
  if (multiselection &&
    multiselected.find(v => v.listEl.contains(target) || target.contains(v.listEl))) {
    console.warn("clicked inside an element already selected. quit");
    return;
  }
  // normal handling select el
  $self.toggleClassListHighlight(target);
  opener.dispatchEvent(
    new CustomEvent('html-tree-builder-click', {
      detail: {
        selected: target,
        target: target["__html-tree-builder-el"],
        e,
        multiselection
      }
    })
  );
}
HtmlTreeBuilder.prototype.expandRecursively = function () {
  openTreeRecursively(this.selected);
}
function getLevels(el, bodyRoot) {
  /*
  var levels = [el];
  while(el && el != bodyRoot){
      if((el.tagName == "HTML" && el.ownerDocument.defaultView.frameElement)||
          (el == el.ownerDocument.body && el != bodyRoot))
          el = el.ownerDocument.defaultView.frameElement;
      else
          el = el.parentNode;
      levels.unshift(el);
  }
  return levels;*/
  var levels = [];
  var swap = el;
  while (swap) {
    levels.unshift(swap);
    swap = swap.parentNode;
  }
  return levels
}
HtmlTreeBuilder.prototype.highlightElement = function (target, highlight = true) {
  //var treeBuilderDOMRepr = htmlTreeBuilderTarget.ownerDocument.querySelector(".html-tree-builder");
  //var treeBuilderDOMRepr = htmlTreeBuilderTarget.children[0];
  //var treeBuilderDOMRepr = htmlTreeBuilderTarget.querySelector(".html-tree-builder-el");
  var rootElement = htmlTreeBuilderTarget.querySelector(".html-tree-builder-el");
  //var levels = getLevels(target,root || rootElement["__html-tree-builder-el"]);
  var levels = getLevels(target);
  levels.forEach((level) => {
    var caret = rootElement.querySelector(".html-tree-builder__caret");
    if(!caret){
      caret = document.createElement("span");
      caret.className = "html-tree-builder__caret";
      rootElement.querySelector(".html-tree-builder-element")
        .insertAdjacentElement('beforeend', caret);
    }
    var li = caret.closest("li");
    if (!li.classList.contains("open"))
      openTree({target: caret});
    var ul = rootElement.querySelector("ul");
    // childrens are represented inside an ul tag ( except for the main html )
    [...ul.children].forEach((children) => {
      if (children["__html-tree-builder-el"] == level)
        rootElement = children;
      /*
      else if(children["__html-tree-builder-el"] &&
          children["__html-tree-builder-el"].nodeName == "IFRAME"){
      }
      */
      /*
      else if(children.classList.contains("html-tree-builder-body")) // we are inside an iframe representation
          if(children.children[0]["__html-tree-builder-el"] == level) // if the body is ancestor, assign it
              rootElement = children.children[0];
              */
    });
  });
  // get rootElement immediately visible by scrolling html-tree-builder container
  if (highlight) {
    this.toggleClassListHighlight(rootElement);
    //rootElement.querySelector(".html-tree-builder-element").scrollIntoView(false);
    var win = rootElement.ownerDocument.defaultView;
    var bound = rootElement.querySelector(".html-tree-builder__tag").getBoundingClientRect();
    win.scroll({
      top: bound.top + (bound.height / 2 ) + win.scrollY - (win.innerHeight / 2),
      left: 0
    });
  }
  return rootElement;
}
function HtmlTreeBuilder(target, el, options = {}) {
  var isDoc = el.nodeType == 9;
  var $self = this;
  el = isDoc ? el.documentElement : el;
  target.innerHTML = "";
  htmlTreeBuilderTarget = target;
  var html = htmlTreeBuilderTarget.ownerDocument.createDocumentFragment();
  var ul = htmlTreeBuilderTarget.ownerDocument.createElement("ul");
  ul.className = "html-tree-builder";
  html.appendChild(ul);
  this.showEmptyNodes = options.showEmptyNodes;
  showEmptyNodes = options.showEmptyNodes;
  treeBuilder(el, ul);

  function hc(e) {
    handleClick(e, $self)
  }

  function mouseover(e) {
    var target = e.target.closest(".html-tree-builder-el");
    if (!target || !target["__html-tree-builder-el"]) return;
    htmlTreeBuilderTarget.dispatchEvent(
      new CustomEvent('html-tree-builder-mouseover', {
        detail: target["__html-tree-builder-el"]
      })
    );
  }

  function mouseout(e) {
    htmlTreeBuilderTarget.dispatchEvent(new Event('html-tree-builder-mouseout'));
  }

  target.appendChild(html);
  target.addEventListener("click", openTree);
  target.addEventListener("click", hc);
  target.addEventListener("mouseover", mouseover);
  target.addEventListener("mouseout", mouseout);
  if (isDoc) {
    var htmlTag = ul.children[0];
    htmlTag.querySelector(".html-tree-builder__caret").click();
    var ulChildrens = htmlTag.querySelector("ul").children;
    for (var HTMLchildrenI = 0; HTMLchildrenI < ulChildrens.length; HTMLchildrenI++) {
      var HTMLchildren = ulChildrens[HTMLchildrenI].children[0];
      if (HTMLchildren.dataset.tagName == "</body>") {
        var caret = HTMLchildren.querySelector(".html-tree-builder__caret");
        caret && caret.click();
        break;
      }
    }
  }
  this.preventDefaultClickOnMs = options.preventDefaultClickOnMs;
  this.target = target;
  this.selected = null;
  this.multiselected = [];
  this.multiselection = false;
  this.removeItemSelected = i => {
    if (typeof i === "undefined")
      i = this.multiselected.length - 1;
    var listEl = this.multiselected[i].listEl;
    listEl.classList.remove("html-tree-builder__highlight");
    this.multiselected.splice(i, 1);
    if (listEl == this.selected) {
      var newIndex = this.multiselected.length - 1;
      this.selected = newIndex > -1 ? this.multiselected[newIndex].listEl : null;
    }
  };
  this.removeMultiSelection = () => {
    this.multiselection = false;
    this.multiselected.forEach(v => v.listEl != this.selected && v.listEl.classList.remove("html-tree-builder__highlight"))
    this.multiselected = [];
  };
  this.activateMultiSelection = () => {
    this.multiselection = true;
    this.selected &&
    this.multiselected.push({listEl: this.selected, el: this.selected["__html-tree-builder-el"]});
  };
  this.clearMultiSelection = () => {
    this.multiselected.forEach(v => v.listEl != this.selected && v.listEl.classList.remove("html-tree-builder__highlight"))
    this.multiselected = [];
  };
  this.deSelect = () => {
    this.selected && this.selected.classList.remove("html-tree-builder__highlight");
    this.selected = null;
  };
  this.el = el;
  this.openTree = openTree;
  this.select = select;
  this.treeBuilder = treeBuilder;
  this.createAttributes = createAttributes;
  this.isInView = isInView;
  this.destroy = () => {
    target.removeEventListener("click", openTree);
    target.removeEventListener("click", hc);
    target.removeEventListener("mouseover", mouseover);
    target.removeEventListener("mouseout", mouseout);
    htmlTreeBuilderTarget = null;
  };
}

window.htmlTreeBuilder = (target, el, options) => {
  return new HtmlTreeBuilder(target, el, options);
}
function isInView(target) {
  return [...htmlTreeBuilderTarget.querySelectorAll("li")]
    .find(v => v["__html-tree-builder-el"] == target);
}
window.addEventListener("resize",e=>{
  var highlights = document.querySelectorAll(".html-tree-builder__highlight");
  highlights.forEach(h=>{
    var treeBuilderElement = h.querySelector(".html-tree-builder__tag");
    var toggleWrapper = h.querySelector(".menu-toggle-wrapper");
    toggleWrapper.style.height = treeBuilderElement.offsetHeight + "px";
  })
});
function openTree(e) {
  if (!e.target.classList.contains("html-tree-builder__caret"))
    return;
  var doc = htmlTreeBuilderTarget.ownerDocument;
  var win = doc.defaultView;
  e.preventDefault && e.preventDefault(); // this is an exposed method, could be called without an event
  var parent = e.target.closest("li");
  var ul = parent.querySelector("ul");
  if (parent.classList.contains("open")) {
    parent.classList.remove("open");
    ul && ul.remove();
  } else {
    parent.classList.add("open");
    if (!ul) {
      ul = doc.createElement("ul");
      parent.lastElementChild.before(ul);
      var el = parent["__html-tree-builder-el"];
      var attributeIs = el.getAttribute("is");
      if (el.tagName == "IFRAME") {
        var link = doc.createElement("a");
        link.href = "javascript:void(0)";
        link.className = "link-to-iframe";
        link.innerHTML = "<span>" + (el.src || '""') + "</span>";
        ul.append(link);
      } else if (el.shadowRoot || win.customElements.get(el.tagName.toLowerCase()) ||
        (attributeIs && win.customElements.get(attributeIs))) {
        var div = doc.createElement("div");
        div.className = "shadow-root";
        div.innerHTML = `<span>#shadow-root ${el.shadowRoot ? "(open)" : "(closed)"}</span>`;
        ul.append(div);
      } else {
        var frag = doc.createDocumentFragment();
        [...el.childNodes].forEach(obj => treeBuilder(obj, frag));
        ul.appendChild(frag);
      }
    }
  }
}
function openTreeRecursively(el) {
  var caret = el.querySelector(".html-tree-builder__caret");
  if (!caret)
    return;
  if (!caret.closest("li").classList.contains("open"))
    openTree({target: caret});
  var ul = el.querySelector("ul");
  var carets = ul.querySelectorAll(".html-tree-builder-el");
  for (var i = 0; i < carets.length; i++)
    openTreeRecursively(carets[i])
}
function select(el) {
  htmlTreeBuilderTarget.innerHTML = "";
  var ul = htmlTreeBuilderTarget.ownerDocument.createElement("ul");
  ul.className = "html-tree-builder";
  ul.appendChild(treeBuilder(el));
  htmlTreeBuilderTarget.appendChild(ul);
  var caret = ul.querySelector(".html-tree-builder__caret");
  caret && openTree({target: caret});
}
function setTogglerPosition(div, target, menuToggler, spanClose) {
  if (!div) return;
  var menuTogglerLeft = div.getBoundingClientRect().left - target.getBoundingClientRect().left;
  menuToggler.style.left = "-" + menuTogglerLeft + "px";
  menuToggler.style.paddingLeft = menuTogglerLeft + "px";
  if (spanClose) {
    spanClose.style.left = "-" + menuTogglerLeft + "px";
    spanClose.style.paddingLeft = menuTogglerLeft + "px";
  }
}
HtmlTreeBuilder.prototype.toggleClassListHighlight = function (element) {
  var multiselection = this.multiselection;
  // toggle previous highlight class
  !multiselection && this.selected && this.selected.classList.remove("html-tree-builder__highlight");
  if(element){
    element.classList.add("html-tree-builder__highlight");
    var treeBuilderElement = element.querySelector(".html-tree-builder__tag");
    var toggleWrapper = element.querySelector(".menu-toggle-wrapper");
    toggleWrapper.style.height = treeBuilderElement.offsetHeight + "px";
  }
  this.multiselection &&
  !this.multiselected.find(v => v.listEl == element) &&
  this.multiselected.push({listEl: element, el: element["__html-tree-builder-el"]});
  if (element)
    this.selected = element;
}
function treeBuilder(el, whereAppend, t) {
  // document case
  /*
   if (el.nodeName == '#document')
   return createDocumentRoot(el);
   */
  var target = t || htmlTreeBuilderTarget;
  var doc = target.ownerDocument;
  var html = doc.createDocumentFragment();
  //exclude comments and empty text fragments
  if (!showEmptyNodes) {
    if (el.nodeName == "#text" && !el.nodeValue.trim().length)
      return html;
  }
  var li = doc.createElement("li");
  var div = doc.createElement("div");
  div.className = "html-tree-builder__tag";
  if (el.nodeName != "#text" && el.nodeName != "#comment")
    div.innerHTML = createElementRepresentation(el);
  else if (el.nodeName == "#text" && el.nodeValue.trim().length)
    div.innerHTML = "<span class='html-tree-builder-node-value' spellcheck='false'>" +
      escapeHtml(el.nodeValue) + "</span>";
  else if (el.nodeName == "#text")
    div.innerHTML = "<span><i><small>empty node</small></i></span>";
  else if (el.nodeName == "#comment")
    div.innerHTML = "<span class='html-tree-builder-comment' spellcheck='false'>" +
      escapeHtml(el.nodeValue) + "</span>";
  li.appendChild(div);
  // create caret if childNodes or is an iframe
  if (el.childNodes.length || el.nodeName == "IFRAME") {
    var caret = doc.createElement("span");
    caret.className = "html-tree-builder__caret";
    div.appendChild(caret)
  }
  // add a css class to represent the closure tag
  // css ::after reads from dataset the tag name ( only when closed)
  if (el.tagName && !el.tagName.match(voidElementsRegex)) {
    div.dataset.tagName = "</" + el.tagName.toLowerCase() + ">";
    div.className += " html-tree-builder-element";
    var spanClose = doc.createElement("span");
    spanClose.className = "span-close";
    spanClose.textContent = "</" + el.tagName.toLowerCase() + ">";
    li.appendChild(spanClose);
  }
  li.classList.add("html-tree-builder-el");
  li["__html-tree-builder-el"] = el;
  createMenuToggler(div,el.tagName?.match(/^(HEAD|BODY|HTML)$/));
  html.appendChild(li);
  whereAppend.appendChild(html);
  return li;
}
})();