appView.addEventListener("click", e => {
  var closest = e.target.closest(".link-button");
  if (!closest)
    return;
  var prop = closest.dataset.prop;
  model[prop + "Link"] = !model[prop + "Link"];
  model[prop + "Unlink"] = !model[prop + "Unlink"];
  t.set("", model);
})