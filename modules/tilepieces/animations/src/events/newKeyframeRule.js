let modalNewKeyframe = document.getElementById("modal-new-keyframe");
let newKeyframeForm = document.getElementById("new-keyframe-form");
let newKeyframeError = document.getElementById("new-keyframe-error");
let newKeyframeName = document.getElementById("new-keyframe-name");
let modalNewKeyframeClose = modalNewKeyframe.querySelector(".modal-animation-close");
let ruleWhereToAppendKeyFrame;
appView.addEventListener("click", e => {
  if (!e.target.closest(".new-keyframe"))
    return;
  newKeyframeForm.value = "";
  var ruleBlock = e.target.closest(".animation__rule-block");
  ruleWhereToAppendKeyFrame = ruleBlock.__animation;
  modalNewKeyframe.style.display = "flex";
  newKeyframeError.style.display = "none";
  modalNewKeyframe.ownerDocument.body.classList.add("modal");
  newKeyframeForm.focus();
});
modalNewKeyframeClose.addEventListener("click", e => {
  modalNewKeyframe.style.display = "none";
  modalNewKeyframe.ownerDocument.body.classList.remove("modal");
});
newKeyframeName.addEventListener("input", e => {
  newKeyframeError.style.display = "none";
});
modalNewKeyframe.addEventListener("keydown", e => {
  if (e.key == "Escape")
    modalNewKeyframeClose.click();
}, true);
newKeyframeForm.addEventListener("submit", e => {
  e.preventDefault();
  var value = e.target[0].value.trim();
  if (!value) {
    newKeyframeError.style.display = "block";
    return;
  }
  try {
    app.core.appendKeyframe(ruleWhereToAppendKeyFrame.rule, value + "%{}");
  } catch (e) {
    newKeyframeError.style.display = "block";
    return;
  }
  ruleWhereToAppendKeyFrame.cssRules = mapKeyframes([...ruleWhereToAppendKeyFrame.rule.cssRules]);
  t.set("", model);
  modalNewKeyframeClose.click();
});