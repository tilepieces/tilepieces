function elementSum(DOMel) {
  return `<span class=element-sum-tag-name>${DOMel.tagName.toLowerCase()}</span>`+
    `${DOMel.id ? `<span class=element-sum-id>#${DOMel.id}</span>` : ``}`+
    `${DOMel.classList.length ? `<span class=element-sum-classes>.${[...DOMel.classList].join(".")}</span>` : ``}`
}