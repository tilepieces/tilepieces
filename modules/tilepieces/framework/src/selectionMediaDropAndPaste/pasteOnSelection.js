document.addEventListener("paste", async e => {
  if (!tilepieces.elementSelected)
    return;
  if(e.target.closest(".tilepieces-dialog"))
    return;
  /*
  if(!tilepieces.core.currentDocument.hasFocus())
      return;*/
  var dt = tilepieces.elementSelected;
  var clipboardData = e.clipboardData;
  if (clipboardData && clipboardData.getData) {
    e.preventDefault();
    var file = clipboardData.files[0];
    if (!file)
      return;
    var name = file.name;
    var ext = name.split(".").pop();
    if (!file) return;
    if (file.type.startsWith("image/") && dt.tagName == "IMG") {
      try {
        var filepath = await tilepieces.utils.dialogNameResolver(file, ext);
        tilepieces.core.htmlMatch.setAttribute(dt, "src", filepath);
      } catch (e) {
        console.error(e);
        dialog.close();
      }
    }
  }
}, true);