appView.addEventListener("click",e=>{
  var iconsWrapper = e.target.closest(".flex-icons")
  if(!iconsWrapper)
      return;
  var key = iconsWrapper.dataset.key;
  var valueButton = e.target.closest("button")
  if(!valueButton)
    return;
  var value = valueButton.dataset.value;
  setCss(key,value);
  var selected = iconsWrapper.querySelector(".selected")
  selected && selected.classList.remove("selected");
  valueButton.classList.add("selected")
  var prop = iconsWrapper.dataset.cssPropJs;
  t.set(prop, value);
  inputCss(appView);
})