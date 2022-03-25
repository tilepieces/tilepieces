function fontFaceRule(fontModel) {
  var fontFace =
    `@font-face {
        src : ${fontModel.srcResources.map(src => {
      if (src.type == "local")
        return `local(${src.local})`;
      else
        return `url(${src.url})${src.format ? ` format(${src.format})` : ""}`;
    })};
        font-family : ${fontModel.mapped.fontFamily};
        ${fontModel.mapped.fontWeight ? `font-weight : ${fontModel.mapped.fontWeight};` : ``}
        ${fontModel.mapped.fontStyle ? `font-style : ${fontModel.mapped.fontStyle};` : ``}
        ${fontModel.mapped.fontDisplay ? `font-display : ${fontModel.mapped.fontDisplay};` : ``}
        ${fontModel.mapped.unicodeRange ? `unicode-range : ${fontModel.mapped.unicodeRange};` : ``}
        ${fontModel.mapped.fontStretch ? `font-stretch : ${fontModel.mapped.fontStretch};` : ``}
        ${fontModel.mapped.fontVariant ? `font-variant : ${fontModel.mapped.fontVariant};` : ``}
        ${fontModel.mapped.fontFeatureSettings ? `font-feature-settings : ${fontModel.mapped.fontFeatureSettings};` : ``}
        ${fontModel.mapped.fontVariationSettings ? `font-variation-settings : ${fontModel.mapped.fontVariationSettings};` : ``}
    }`;
  return fontFace
}