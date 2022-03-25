insertionModeInput.addEventListener("change", e => {
  app.insertionMode = insertionModeInput.value;
  app.elementSelected && selectButtonsToInsert(app.selectorObj);
});