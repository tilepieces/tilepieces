function createStyleSheetText(styleSheet) {
  return [...styleSheet.cssRules].map(v => v.cssText).join("\n")
}