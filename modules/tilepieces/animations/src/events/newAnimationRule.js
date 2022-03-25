let modalNewAnimation = document.getElementById("modal-new-animation");
let newAnimationForm = document.getElementById("new-animation-form");
let newAnimationError = document.getElementById("new-animation-error");
let newAnimationName = document.getElementById("new-animation-name");
let modalNewAnimationClose = modalNewAnimation.querySelector(".modal-animation-close");
newAnimationButton.addEventListener("click", e => {
  newAnimationForm[0].value = "";
  modalNewAnimation.style.display = "flex";
  newAnimationError.style.display = "none";
  modalNewAnimation.ownerDocument.body.classList.add("modal");
  newAnimationForm[0].focus();
});
modalNewAnimationClose.addEventListener("click", e => {
  modalNewAnimation.style.display = "none";
  modalNewAnimation.ownerDocument.body.classList.remove("modal");
});
newAnimationName.addEventListener("input", e => {
  newAnimationError.style.display = "none";
});
modalNewAnimation.addEventListener("keydown", e => {
  if (e.key == "Escape")
    modalNewAnimationClose.click();
}, true);
newAnimationForm.addEventListener("submit", e => {
  e.preventDefault();
  var value = e.target[0].value.trim();
  if (!value) {
    newAnimationError.style.display = "block";
    return;
  }
  if (model.animations.find(v => v.name == value)) {
    // TODO
    newAnimationError.style.display = "block";
    return;
  }
  if (!app.core.currentStyleSheet) {
    app.core.createCurrentStyleSheet("");
  }
  var newRule;
  try {
    newRule = app.core.insertCssRule(app.core.currentStyleSheet, "@keyframes " + value + "{}");
  } catch (e) {
    newAnimationError.style.display = "block";
    return;
  }
  app.core.appendKeyframe(newRule, "0%{}");
  app.core.appendKeyframe(newRule, "100%{}");
  var newAnimation = app.core.currentStyleSheet.cssRules[app.core.currentStyleSheet.cssRules.length - 1];
  app.core.styles.animations.push(newAnimation);
  var newMappedAnimation = mapAnimations(newAnimation, model.animations.length);
  var alreadySel = model.animations.find(a => a.show);
  alreadySel && (alreadySel.show = false);
  newMappedAnimation.show = true;
  model.animations.push(newMappedAnimation);
  t.set("", model);
  modalNewAnimationClose.click();
  var animationKeyframe = appView.querySelector(".animation_keyframe.true");
  appView.ownerDocument.defaultView.scrollTo(0, animationKeyframe.offsetTop);
});