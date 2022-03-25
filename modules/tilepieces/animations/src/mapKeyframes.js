function mapKeyframes(keyframes, contenteditable = "contenteditable") {
  return keyframes.map((keyframe, kindex) => {
    var isEditable = contenteditable == "contenteditable";
    var properties = opener.getCssTextProperties(keyframe.style.cssText).map((v, i) => {
      v.index = i;
      v.checked = true;
      v.disabled = contenteditable ? "" : "disabled";
      v.contenteditable = contenteditable;
      v.autocomplete_suggestions = window.cssDefaults[v.property] || [];
      return v
    });
    var hasCachedProperties = opener.tilepieces.core.cachedProperties.find(v => v.rule == newRule.rule);
    if (hasCachedProperties) {
      hasCachedProperties.properties.forEach(v => {
        if (properties.find(pr => pr.property == v.property && pr.value == v.value)) {
          var indexCached = hasCachedProperties.properties.findIndex(hc => hc.property == v.property && hc.value == v.value);
          hasCachedProperties.properties.splice(indexCached, 1);
          if (!hasCachedProperties.properties.length) {
            opener.tilepieces.core.cachedProperties.splice(opener.tilepieces.core.cachedProperties.indexOf(hasCachedProperties), 1);
          }
          return;
        }
        v.index = properties.length;
        v.disabled = isEditable ? "" : "disabled";
        v.contenteditable = isEditable && v.checked ? "contenteditable" : "";
        properties.push(v);
      })
    }
    return {
      keyText: keyframe.keyText,
      properties,
      isEditable,
      contenteditable,
      rule: keyframe,
      index: kindex
    }
  }).sort((a, b) => {
    var c1 = a.keyText.match(/\d+/)[0];
    var c2 = b.keyText.match(/\d+/)[0];
    return c1 - c2;
  })
}