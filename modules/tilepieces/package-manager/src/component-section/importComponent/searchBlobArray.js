async function searchBlobArrayComponent(array, componentName) {
  var returnArray = [];
  for (var i = 0; i < array.length; i++) {
    var v = array[i];
    var results = await app.storageInterface.search("", v, null, componentName);
    returnArray = returnArray.concat(results.searchResult);
  }
  return returnArray;
}