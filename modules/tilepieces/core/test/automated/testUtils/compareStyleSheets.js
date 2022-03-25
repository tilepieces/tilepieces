function compareStyleSheets(matchObj) {
  var style = tilepieces.core.currentStyleSheet;
  var styleSource = tilepieces.core.matchCurrentStyleSheetNode;
  var htmltext = doc.documentElement.outerHTML;
  var htmlMatchText = docSource.documentElement.outerHTML;
  logOnDocument(
    assert(htmltext == htmlMatchText, "documents are equals"), "success");
  if (matchObj) {
    logOnDocument(
      assert(htmltext.replace(/(\r\n|\n|\r|\t|\s)/gm, "") == matchObj.htmltext.replace(/(\r\n|\n|\r|\t|\s)/gm, "")
        &&
        htmlMatchText.replace(/(\r\n|\n|\r|\t|\s)/gm, "") == matchObj.htmlMatchText.replace(/(\r\n|\n|\r|\t|\s)/gm, "")
        , "document are equals with the previous one")
      , "success");
  }
  return {htmltext, htmlMatchText}
}