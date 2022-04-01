async function search(endsFilesAccepted,customSearch){
  try {
    searchResult = await storageInterface.search("",customSearch || searchEnum[type]);
  }
  catch(e){
    searchResult = {searchResult:[]};
    storageInterfaceError = true;
  }
  var searchResults = searchResult.searchResult.filter(v=>endsFilesAccepted.find(ef=>v.endsWith(ef)))
  var resources = searchResults.map(i=>{
    return{
      src:tilepieces.frameResourcePath() + "/" + i,
      filename:i.split(/[\\/]/).pop()
    }
  });
  if(resources.length>paginationItems) {
    pagination = {
      total : resources.slice(0),
      pages : Math.ceil(resources.length / paginationItems),
      page:1,
      pointer:0
    };
    resources = resources.slice(0, paginationItems);
  }
  else pagination = null;
  return {resources,pagination};
}