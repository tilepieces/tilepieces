buttonSetTemplate.addEventListener("click",async e=>{
  var selected = pt && pt.selected[0];
  dialog.open("loading " + selected.dataset.path,true)
  try{
    var fileText = await storageIntegration.read(selected.dataset.path)
    if(typeof fileText != "string"){
      alertDialog("This file appears not to be a text file and therefore cannot be opened.", true);
      return;
    }
    await app.changeSettings("template", fileText);
    app.template = fileText;
    dialog.close();
    tooltipEl.style.display="none";
  }
  catch(e){
    alertDialog(e.error || e.err || e.toString(), true);
    console.error(e)
  }
});