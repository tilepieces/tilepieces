const infoDialog = document.getElementById("tilepieces-dialog-info");
const infoDialogContent = infoDialog.content;
infoDialogContent.querySelector("[data-tilepieces-version]").textContent = tilepieces.version;
document.getElementById("info-trigger").addEventListener("click",e=>{
  dialog.open(infoDialogContent.cloneNode(true))
});