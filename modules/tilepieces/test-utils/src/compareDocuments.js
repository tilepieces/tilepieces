function compareDocuments(matchObj) {
  var doc = tilepieces.core.currentDocument;
  var docSource = tilepieces.core.htmlMatch.source;
  var htmltext = tilepieces.core.createDocumentText(doc);
  var htmlMatchText = tilepieces.core.createDocumentText(docSource);
  try {
    logOnDocument(
      assert(htmltext == htmlMatchText, "documents are equals"), "success");
    if (matchObj) {
      logOnDocument(
        assert(htmltext == matchObj.htmltext &&
          (!matchObj.htmlMatchText || htmlMatchText == matchObj.htmlMatchText)
          , "document are equals with the previous one")
        , "success");
    }
  } catch (e) {
    console.error("htmltext,htmlMatchText,matchObj", htmltext, htmlMatchText, matchObj);
    throw(e);
  }
  return {htmltext, htmlMatchText}
}