let togglePseudoStates = document.getElementById("toggle-pseudo-states");
let togglePseudoElements = document.getElementById("toggle-pseudo-elements");
togglePseudoStates.addEventListener("click", e => {
  model.showMainRules = model.showPseudoStates; //? true : false;
  model.showPseudoElements = false;
  togglePseudoElements.classList.remove("pseudo-trigger-selected");
  togglePseudoStates.classList.toggle("pseudo-trigger-selected");
  model.showPseudoStates = !model.showPseudoStates;
  t.set("", model);
});
togglePseudoElements.addEventListener("click", e => {
  model.showMainRules = model.showPseudoElements; //? true : false;
  model.showPseudoStates = false;
  togglePseudoStates.classList.remove("pseudo-trigger-selected");
  togglePseudoElements.classList.toggle("pseudo-trigger-selected");
  model.showPseudoElements = !model.showPseudoElements;
  t.set("", model);
});