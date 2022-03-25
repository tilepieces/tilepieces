document.addEventListener("drop", async function (e) {
  var t = e.target;
  if (!t.classList.contains("highlight-selection"))
    return;
  e.preventDefault();
  var dt = t.__target;
  var files = e.dataTransfer.files;
  var videoTag = dt.closest("video");
  if (files) {
    var file = files[0];
    var type = file.type;
    var name = file.name;
    var ext = name.split(".").pop();
    if (type.startsWith("image/") && dt.tagName == "IMG") {
      try {
        try {
          var filepath = await tilepieces.utils.dialogNameResolver(file, ext);
        }
        catch(e){
          if(e)
            throw e;
          else {
            return;
          }
        }
        tilepieces.core.htmlMatch.setAttribute(dt, "src", filepath);
      } catch (e) {
        console.error(e);
        alertDialog("error on trying to save " + filepath,true);
      }
    }
    if (type.startsWith("video/") && videoTag) {
      try {
        try {
          var filepath = await tilepieces.utils.dialogNameResolver(file, ext);
        }
        catch(e){
            if(e)
              throw e;
            else {
              dialog.close();
              return;
            }
        }
        var source = videoTag.querySelector("source[type='" + type + "'");
        if (!source) {
          source = videoTag.getRootNode().createElement("source");
          source.type = type;
          tilepieces.core.htmlMatch.append(videoTag, source);
        }
        tilepieces.core.htmlMatch.setAttribute(source, "src", filepath);
        videoTag.load();
      } catch (e) {
        console.error(e);
        alertDialog("error on trying to save " + filepath,true);
      }
    }
  }
});
document.addEventListener("dragover", function (e) {
  e.preventDefault();
});
document.addEventListener("dragenter", function (e) {
  e.preventDefault();
}, false);