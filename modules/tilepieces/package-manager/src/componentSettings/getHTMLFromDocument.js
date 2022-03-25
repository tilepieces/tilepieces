async function getHTMLFromDocument(objectPointerString = "html") {
  var defaultPath = app.htmlDefaultPath.match(/(\\)$|(\/)$/) ? app.htmlDefaultPath : app.htmlDefaultPath + "/";
  var div = document.createElement("div");
  [...app.core.htmlMatch.source.body.childNodes].forEach(v => div.append(v.cloneNode(true)));
  [...div.querySelectorAll("script,link,style")].forEach(v => v.remove());
  var html = settingsTT.getParamFromString(objectPointerString);
  var path = html || (defaultPath + settingsModel.name + ".html");
  try {
    await app.storageInterface.update(path, new Blob([div.innerHTML]));
  } catch (e) {
    console.error("[error in saving component default html]", e);
    openerDialog.open("error in saving component default html");
  }
  settingsTT.set(objectPointerString, path)
}