(()=>{
  const storageInterface = tilepieces.storageInterface || top.storageInterface; // for testing
  if(!storageInterface){
    console.warn("introduction dialog can't find a storageInterface")
    return;
  }
  const dialogTemplates = document.getElementById("dialog-templates");
  const contentTemplate = document.createElement("div");
  contentTemplate.append(dialogTemplates.content.cloneNode(true))
  const templateDialogContent = new TT(contentTemplate, {templates:[]});
  dialog.dialogElement.addEventListener("click",async e=>{
    if(!e.target.classList.contains("dialog-templates-download"))
      return;
    var root = e.target.dataset.root;
    var link = e.target.dataset.link;
    var rootlink = root + link;
    dialog.open("download "+ rootlink + ".<br>This may take a few seconds. Please wait.",true);
    try{
      var prRaw = await fetch(rootlink);
      await tilepieces.utils.importProjectAsZip(await prRaw.blob())
    }
    catch(e){
      dialog.close();
      console.error(e);
      alertDialog(e.toString() + "\nOpen browser console for more info.",true);
    }
  });
  tilepieces.getTemplatesDialog = async function(){
    try{
      var res = await fetch("https://raw.githubusercontent.com/tilepieces/templates/main/templates.json")
      var templates = await res.json();
      templateDialogContent.set("",{templates});
      dialog.open(contentTemplate);
    }
    catch(e){
      console.error(e);
      alertDialog("Read error https://raw.githubusercontent.com/tilepieces/templates/main/templates.json. Open browser console for more info.",true);
    }
  };
})();