addGrButton.addEventListener("click", e => {
  e.stopPropagation();
  appendOn = model.grChosen ? model.grChosen.rule : null;
  model.mediaQueryUIMaskFeatures = [{
    logicalOperator: "and", feature: "max-width",
    value: app.core.currentWindow.innerWidth + "px", featureInput: "input", index: 0
  }];
  modalNewGr.style.display = "block";
  modalNewGr.ownerDocument.body.classList.add("modal");
  changeMediaCondition()
});
modalNewGr.querySelector(".modal-new-gr-close").addEventListener("click", e => {
  modalNewGr.style.display = "none";
  modalNewGr.ownerDocument.body.classList.remove("modal");
});