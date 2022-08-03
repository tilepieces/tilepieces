attributesView.addEventListener("click", e => {
  if (!e.target.closest(".go-to-component"))
    return;
  e.preventDefault();
  app.setFrame(e.target.dataset.href);
})
