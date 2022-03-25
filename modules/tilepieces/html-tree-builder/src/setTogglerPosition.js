function setTogglerPosition(div, target, menuToggler, spanClose) {
  if (!div) return;
  var menuTogglerLeft = div.getBoundingClientRect().left - target.getBoundingClientRect().left;
  menuToggler.style.left = "-" + menuTogglerLeft + "px";
  menuToggler.style.paddingLeft = menuTogglerLeft + "px";
  if (spanClose) {
    spanClose.style.left = "-" + menuTogglerLeft + "px";
    spanClose.style.paddingLeft = menuTogglerLeft + "px";
  }
}