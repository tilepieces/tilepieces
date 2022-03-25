buttonDeleteFile.addEventListener("click", e => {
  if (pt && pt.selected[0])
    pt.delete(null, pt.selected[0]);
});