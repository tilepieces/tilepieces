function isInView(target) {
  return [...htmlTreeBuilderTarget.querySelectorAll("li")]
    .find(v => v["__html-tree-builder-el"] == target);
}