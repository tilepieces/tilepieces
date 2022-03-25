function click(e) {
  if (e.target.nodeName != "DT" && e.target.parentElement.nodeName != "DT")
    return;
  update(e.target, true);
}