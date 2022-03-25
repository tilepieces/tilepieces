window.addEventListener("onContentEditablePasteImage", async e => {
  var target = e.detail.target;
  var file = e.detail.file;
  var ext = file.name.split(".").pop();
  try {
    var imageUrl = await tilepieces.utils.dialogNameResolver(file, ext);
  }
  catch(e){
    if(e){
      alertDialog(e.error || e.err || e.toString(),true);
    }
    return;
  }
  var image = target.getRootNode().createElement("img");
  image.onload = () => {
    target.dispatchEvent(new KeyboardEvent("input", {bubbles: true}));
    window.dispatchEvent(new Event("WYSIWYG-modify"))
  };
  var sel, range;
  image.src = imageUrl;
  sel = target.ownerDocument.defaultView.getSelection();
  range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(image);
});