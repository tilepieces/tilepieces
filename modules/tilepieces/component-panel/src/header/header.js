const opener = window.opener || window.top || window;
const app = opener.tilepieces;
const dialog = opener.dialog;
const templatesDOM = document.querySelectorAll("template");
let templates = {};
const textPermittedPhrasingTags = app.utils.textPermittedPhrasingTags;
const textPermittedFlowTags = app.utils.textPermittedFlowTags;
for (var i = 0; i < templatesDOM.length; i++) {
  var v = templatesDOM[i];
  templates[v.dataset.id] = v.content;
}
tilepieces_tabs({
  el: document.getElementById("tab-component")
});
const tagsSection = document.getElementById("standard-tags");
const buttons = [...tagsSection.querySelectorAll("button.first-button")];
const utf8CharsSection = document.getElementById("utf-8-characters");
const utf8CharsDetails = [...utf8CharsSection.querySelectorAll("details")];
const insertionModeInput = document.getElementById("insertion-mode");
const componentSection = document.getElementById("components");
const componentSectionRoot = componentSection.querySelector("ul");
const componentChildTemplate = document.getElementById("component-child");
const newTagNameInput = document.getElementById("new-tag-name");
const addNewTagForm = document.getElementById("add-new-tag-form");
const addNewTagFormSmall = addNewTagForm.querySelector("small");
const addNewTagFormButton = addNewTagForm.querySelector("button[type=submit]");
componentSectionRoot.hidden = !app.elementSelected;
insertionModeInput.value = app.insertionMode;
let componentModel = {
  components: turnComponentsToArray(app.localComponents) || []
};
const componentTemplate = new opener.TT(componentSection, componentModel);
opener.addEventListener("highlight-click", e => {
  selectButtonsToInsert(app.selectorObj);
  newTagNameInput.disabled = !app.selectorObj.match;
  addNewTagFormButton.disabled = !app.selectorObj.match;
});
opener.addEventListener("edit-mode", e => {
  if (app.editMode && app.elementSelected) {
    selectButtonsToInsert(app.selectorObj);
    newTagNameInput.disabled = !app.selectorObj.match;
    addNewTagFormButton.disabled = !app.selectorObj.match;
  } else {
    newTagNameInput.disabled = true;
    addNewTagFormButton.disabled = true;
  }
});
opener.addEventListener("deselect-element", e => {
  buttons.forEach(v => v.disabled = true);
  utf8CharsDetails.forEach(detail => {
    detail.open && detail.removeAttribute("open");
    detail.classList.add("disabled")
  });
  newTagNameInput.disabled = true;
  addNewTagFormButton.disabled = true;
  componentSectionRoot.hidden = true;
});
opener.addEventListener("WYSIWYG-start", e => {
  selectButtonsContentEditable(e.detail);
  componentSectionRoot.hidden = true;
  newTagNameInput.disabled = true;
  addNewTagFormButton.disabled = true;
});
opener.addEventListener("WYSIWYG-end", () => {
  selectButtonsToInsert(app.selectorObj);
  newTagNameInput.disabled = !app.selectorObj.match;
  addNewTagFormButton.disabled = !app.selectorObj.match;
});
opener.addEventListener("content-editable-end", () => {
  utf8CharsDetails.forEach(detail => {
    detail.open && detail.removeAttribute("open");
    detail.classList.add("disabled")
  });
  //componentTemplate.set("disabled",app.elementSelected ? "" : "disabled");
  if (app.elementSelected)
    componentSectionRoot.hidden = false;
});

if (app.lastEditable && app.lastEditable.el)
  selectButtonsContentEditable(app.lastEditable.el);
if (app.elementSelected)
  selectButtonsToInsert(app.selectorObj);
