async function submitSearch(endsFilesAccepted){
  //dialog.open("searching...");
  try {
    var {resources,pagination} = await search(endsFilesAccepted,fileSearchInput.value);
    globalModel.resources = resources;
    globalModel.pagination = pagination;
    t.set("",globalModel)
    //dialog.close();
  }
  catch(e){
    console.error(e);
    dialog.close();
    alertDialog(e.err || e.error || e.toString(),true);
  }
}