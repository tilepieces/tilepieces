function setFlexIcon(name,value) {
  var wrapper = appView.querySelector(`.flex-icons[data-key="${name}"]`);
  var sel = wrapper.querySelector("button.selected");
  sel && sel.classList.remove("selected");
  var buttonToSelect = wrapper.querySelector(`button[data-value="${value}"]`);
  buttonToSelect && buttonToSelect.classList.add("selected");
}