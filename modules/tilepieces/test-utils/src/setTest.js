function setTest(frameUrl, frameEl) {
  return new Promise((resolve, reject) => {
    try {
      tilepieces.workspace = "";
      let testFrameUrl = frameUrl || "test-frame.html";
      let frame = frameEl || document.getElementById("frame");
      frame.addEventListener("load", async () => {
        var html = await fetch(testFrameUrl);
        var htmlText = await html.text();
        tilepieces.core = await tilepiecesCore().init(frame.contentDocument, htmlText);
        resolve();
      });
      frame.addEventListener("error", (e) => {
        reject(e);
      });
      frame.src = testFrameUrl;
    } catch (e) {
      reject(e)
    }
  });
}