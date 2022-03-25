appView.addEventListener("click", e => {
  if (!e.target.classList.contains("related-selectors-select"))
    return;
  e.preventDefault();
  if (model.relatedSelectors.length <= 1)
    return;
});