appView.addEventListener("borderImageInput", e => {
  var target = e.detail.target;
  opener.tilepieces.utils.processFile(target.files[0]).then(res => {
    if (res)
      setCss("border-image-source", res);
  })
});