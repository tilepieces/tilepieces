async function newJSZip(){
  if (!tilepieces.JSZip) {
    await import("/modules/tilepieces/jszip/jszip.min.js");
    tilepieces.JSZip = JSZip
  }
  return new tilepieces.JSZip();
}