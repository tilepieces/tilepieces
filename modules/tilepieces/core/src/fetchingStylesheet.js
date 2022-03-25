// https://bugs.chromium.org/p/chromium/issues/detail?id=922618&q=stylesheet%20href%20change&can=2
// can't use onload on chrome already added nodes even changing the href.
// however, maybe that's the only way ( safari has problem too )
TilepiecesCore.prototype.fetchingStylesheet = function (href) {
  var $self = this;
  return new Promise((resolve, reject) => {
    if(!href.match(tilepieces.utils.URLIsAbsolute)){
      var hrefParsed = href[0] == "/" ? encodeURI(app.utils.paddingURL(app.frameResourcePath())) + href.substring(1) : href;
      href = new URL(hrefParsed, tilepieces.core.currentWindow.location.href)
    }
    fetch(href).then(res => {
      if (res.status != 200) {
        console.error("[error loading stylesheet, status != 200]->", res);
        reject(res)
      } else {
        var contentType = res.headers.get('Content-Type');
        var contentTypeTokens = contentType ? contentType.split(";") : [];
        if (contentTypeTokens.find(v => v.trim() == "text/css"))
          resolve();
        else {
          console.error("[error loading stylesheet, content-type mismatch]->", res);
          reject(res)
        }
      }
    }, err => {
      console.error("[error loading stylesheet]->", err);
      reject(err)
    });
  })
}

function longPollingStyleSheet(style, cb) {
  if (!style.sheet) {
    setTimeout(() => {
      longPollingStyleSheet(style, cb)
    });
  } else cb();
}
