function setTestFramework(frameTarget, frameUrl, workspace = "") {
  return new Promise((resolve, reject) => {
    var cWin, cDoc, tilepieces;
    frameTarget.addEventListener("load", e => {
      try {
        cWin = frameTarget.contentWindow;
        cDoc = frameTarget.contentDocument;
        tilepieces = cWin.tilepieces;
        tilepieces.workspace = workspace;
        cWin.addEventListener("html-rendered", e => {
          resolve({e, cWin, cDoc, tilepieces});
        });
        tilepieces.setFrame(frameUrl);
      } catch (e) {
        reject(e)
      }
    });
    frameTarget.addEventListener("error", (e) => {
      reject(e);
    });
    frameTarget.src = "index.html";
  })
}