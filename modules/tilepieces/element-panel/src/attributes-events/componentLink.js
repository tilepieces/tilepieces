attributesView.addEventListener("click", e => {
  var t = e.target.closest(".go-to-component");
  if (!t)
    return;
  e.preventDefault();
  app.setFrame(t.dataset.href);
})
