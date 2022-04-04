function linkToHTML(e){
  e.preventDefault();
  var iframePath = settingsModel.__local ? app.utils.paddingURL(settingsModel.path) : "/";
  app.setFrame((iframePath + settingsModel.html).replace(/\/+/g,"/"));
}