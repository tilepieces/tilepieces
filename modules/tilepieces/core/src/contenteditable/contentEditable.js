window.addEventListener("WYSIWYG-end", () => {
  tilepieces.lastEditable = null;
});
TilepiecesCore.prototype.contenteditable = function (target) {
  tilepieces.lastEditable = tilepieces.core.htmlMatch.contenteditable(target);
}