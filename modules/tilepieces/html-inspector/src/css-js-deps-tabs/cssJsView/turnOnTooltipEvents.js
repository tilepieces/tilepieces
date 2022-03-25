cssViewTooltip.addEventListener("blur", e => {
  cssViewTooltip.style.display = "none"
});
jsViewTooltip.addEventListener("blur", e => {
  jsViewTooltip.style.display = "none"
});

function cssJsViewCM(e, handleTooltipFunc) {
  var li = e.target.closest("li");
  if (!li) return;
  selectedJsCSS != li && li.click();
  e.preventDefault();
  handleTooltipFunc(li, e);
}

cssViewDOMList.addEventListener("contextmenu", e => cssJsViewCM(e, handleCssTooltip));
jsViewDOMList.addEventListener("contextmenu", e => cssJsViewCM(e, handleJsTooltip));