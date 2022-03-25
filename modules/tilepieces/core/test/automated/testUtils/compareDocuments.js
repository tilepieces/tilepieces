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
        assert(htmltext.replace(/(\r\n|\n|\r|\t|\s)/gm, "") == matchObj.htmltext.replace(/(\r\n|\n|\r|\t|\s)/gm, "") &&
          (!matchObj.htmlMatchText ||
            htmlMatchText.replace(/(\r\n|\n|\r|\t|\s)/gm, "") == matchObj.htmlMatchText.replace(/(\r\n|\n|\r|\t|\s)/gm, ""))
          , "document are equals with the previous one")
        , "success");
    }
  } catch (e) {
    console.error("htmltext,htmlMatchText,matchObj", htmltext, htmlMatchText, matchObj?.htmltext);
    throw(e);
  }
  return {htmltext, htmlMatchText}
}