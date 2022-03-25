function setGradientEls() {
  return [...appView.querySelectorAll(".gradient")].map(gEl => {
    var isAlreadyGradientObject = gradientsEls.find(v => v.gradientDOM == gEl);
    var index = +gEl.closest(".backgrounds").dataset.index;
    if (!isAlreadyGradientObject)
      return createNewGradient(gEl, index);
    else {
      isAlreadyGradientObject.set(model.backgrounds[index].gradientModel);
      return isAlreadyGradientObject;
    }
  });
}