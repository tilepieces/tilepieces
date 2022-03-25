function notAdmittedTagNameInPosition(tagName, composedPath) {
  var doc = composedPath[0].ownerDocument;
  if (tagName == "MAIN")
    return doc.querySelector("main:not([hidden])") ||
      composedPath.find(v => v.tagName &&
        !v.tagName.match(/^(HTML|BODY|DIV|FORM)$/));
  if (tagName.match(tilepieces.utils.phrasingTags))
    return composedPath.find((v, i) =>
        v.tagName && (
          (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
          v.tagName.match(tilepieces.utils.notEditableTags)
        )
    );
  if (tagName.match(tilepieces.utils.restrictedFlowInsideTags))
    return composedPath.find((v, i) => v.tagName && (
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
        (tagName != "P" && v.tagName == "ADDRESS") ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags) ||
        v.tagName.match(tilepieces.utils.notEditableTags) ||
        v.tagName.match(tilepieces.utils.phrasingTags)
      )
    );
  if (tagName.match(/^(ARTICLE|SECTION|NAV|ASIDE|ADDRESS)$/))
    return composedPath.find((v, i) => v.tagName && (
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
        v.tagName == "ADDRESS" ||
        v.tagName.match(tilepieces.utils.notEditableTags) ||
        v.tagName.match(tilepieces.utils.phrasingTags) ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
      )
    );
  if (tagName.match(/^(HEADER|FOOTER)$/))
    return composedPath.find((v, i) => v.tagName && (
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
        v.tagName.match(/^(ADDRESS|FOOTER|HEADER)$/) ||
        v.tagName.match(tilepieces.utils.notEditableTags) ||
        v.tagName.match(tilepieces.utils.phrasingTags) ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
      )
    );
  if (tagName == "FORM")
    return composedPath.find((v, i) => v.tagName && (
        v.tagName == "FORM" ||
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
        v.tagName.match(tilepieces.utils.notEditableTags) ||
        v.tagName.match(tilepieces.utils.phrasingTags) ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
      )
    );
  if (tagName == "DIV")
    return composedPath.find((v, i) => v.tagName && (
        (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0 && v.tagName != "DL") ||
        v.tagName.match(tilepieces.utils.phrasingTags) ||
        v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
      )
    );
  if (tagName == "LI")
    return !composedPath[0].tagName.match(/^(UL|OL)$/);
  if (tagName.match(/^(DD|DT)$/))
    return composedPath[0].tagName != "DL";
  if (tagName == "SOURCE")
    return !composedPath[0].tagName.match(/^(VIDEO|AUDIO|PICTURE)$/);
  if (tagName.match(/^(META|LINK|STYLE)$/))
    return composedPath[0].tagName != "HEAD";
  if (tagName == "TITLE")
    return composedPath[0].tagName != "HEAD" || doc.querySelector("title");
  if (tagName.match(/^(CAPTION|COLGROUP|THEAD|TBODY|TFOOT)$/))
    return composedPath[0].tagName != "TABLE";
  if (tagName.match(/^(TD|TH)$/))
    return composedPath[0].tagName != "TR";
  if (tagName == "TR")
    return !composedPath[0].tagName.match(/THEAD|TBODY|TFOOT/);
  if (tagName == "TRACK")
    return !composedPath[0].tagName.match(/VIDEO|AUDIO/);
  if (tagName == "OPTGROUP")
    return composedPath[0].tagName != "SELECT";
  if (tagName == "OPTION")
    return !composedPath[0].tagName.match(/SELECT|OPTGROUP|DATALIST/);
  if (tagName.match(/^(HTML|BODY|HEAD)$/))
    return true;
  return composedPath.find((v, i) => v.tagName && (
      (v.tagName.match(tilepieces.utils.notInsertableTags) && i == 0) ||
      v.tagName.match(tilepieces.utils.notEditableTags) ||
      v.tagName.match(tilepieces.utils.phrasingTags) ||
      v.tagName.match(tilepieces.utils.restrictedFlowInsideTags)
    )
  )
}