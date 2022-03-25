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