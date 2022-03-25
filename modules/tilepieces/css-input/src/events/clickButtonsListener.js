function clickButtonsListener(e) {
  var inputCssPlaceholder = e.target.closest(".input-css-placeholder");
  var t = e.target;
  var isColorButton = t.classList.contains("span-color-button");
  var isNumberArrowUp = t.classList.contains("arrow-up");
  var isNumberArrowDown = t.classList.contains("arrow-down");
  var isSearchImgInProjectButton = t.classList.contains("input-css-search-image-in-project");
  if (isColorButton)
    colorButtonClick(e);
  else if (isNumberArrowUp || isNumberArrowDown) {
    var numberSpan = t.parentNode.querySelector(".number-value");
    var originalDecimalLength = numberSpan.textContent.split(".")[1];
    var numberValue = +numberSpan.textContent;
    var newValue = isNumberArrowUp ? numberValue + 1 : numberValue - 1;
    numberSpan.textContent = originalDecimalLength ? newValue.toFixed(originalDecimalLength.length) : newValue;
    setText(inputCssPlaceholder)
  } else if (isSearchImgInProjectButton)
    clickImageInProject(e);
}