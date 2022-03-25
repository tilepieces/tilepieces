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