appView.addEventListener("dropzone-dropping", onDropFiles, true);

async function onDropFiles(e) {
  e.preventDefault();
  var dropzone = e.detail.target;
  var file = e.detail.files[0];
  if (!file)
    return;
  var font = e.target.closest(".font");
  var fontModel = model.fonts[font.dataset.index];
  var index = +dropzone.nextElementSibling.dataset.index;
  var result = await app.utils.processFile(file, null, app.core.currentStylesheet?.href?.replace(location.origin, ""));
  fontModel.srcResources[index].url = result;
  appView.dispatchEvent(new CustomEvent("template-digest", {detail: {target: e.target}}))
}