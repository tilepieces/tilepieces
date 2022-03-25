async function search(cName, pName) {
  logOnDocument("search", "larger");
  var search = await storageInterface.search("", "index.html", null, cName, pName);
  logOnDocument(
    assert(search.searchResult.length == 1 &&
      search.searchResult[0] == "index.html",
      "search index.html works as expected")
    , "success");
  search = await storageInterface.search("", "**/*.js", null, cName, pName);
  logOnDocument(
    assert(search.searchResult.length == 2 &&
      search.searchResult.indexOf("js/js.js") > -1 &&
      search.searchResult.indexOf("js/vendor/test.js") > -1,
      "search **/*.js works as expected")
    , "success");
  search = await storageInterface.search("", "**/*.js", {pattern: "alert"}, cName, pName);
  logOnDocument(
    assert(search.searchResult.length == 1 &&
      search.searchResult[0] == "js/vendor/test.js",
      "search **/*.js with regex pattern 'alert' works as expected")
    , "success");
}