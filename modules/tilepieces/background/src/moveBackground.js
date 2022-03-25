// type : 0 up, 1 down
function moveBackground(type, index) {
  var moveIndex = type ? index + 1 : index - 1;
  var swap = model.backgrounds[index];
  model.backgrounds[index] = model.backgrounds[moveIndex];
  model.backgrounds[index].index = index;
  model.backgrounds[moveIndex] = swap;
  model.backgrounds[moveIndex].index = moveIndex;
  setCss("background-image", createNewBgProp("backgroundImage"));
  setCss("background-repeat", createNewBgProp("backgroundRepeat"));
  setCss("background-position", createNewBgProp("backgroundPosition"));
  setCss("background-origin", createNewBgProp("backgroundOrigin"));
  setCss("background-clip", createNewBgProp("backgroundClip"));
  setCss("background-attachment", createNewBgProp("backgroundAttachment"));
  setCss("background-size", createNewBgProp("backgroundSize"));
  setCss("background-blend-mode", createNewBgProp("backgroundBlendMode"));
  model.tabToSelect = moveIndex;
  t.set("", model);
  if (model.backgrounds[index].hasGradient)
    gradientsEls.push(createNewGradient(appView.querySelector(".backgrounds[data-index='" + index + "'] .gradient"), index));
  if (model.backgrounds[moveIndex].hasGradient)
    gradientsEls.push(createNewGradient(appView.querySelector(".backgrounds[data-index='" + moveIndex + "'] .gradient"), moveIndex));
  inputCss(appView);
}

appView.addEventListener("click", e => {
  if (!e.target.classList.contains("move-background-up")) return;
  moveBackground(0, +e.target.dataset.index);
})
appView.addEventListener("click", e => {
  if (!e.target.classList.contains("move-background-down")) return;
  moveBackground(1, +e.target.dataset.index);
})