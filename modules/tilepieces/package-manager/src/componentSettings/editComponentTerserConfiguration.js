async function editComponentTerserConfiguration(){
  app.codeMirrorEditor(JSON.stringify(settingsModel.terserConfiguration), "json")
    .then(res => {
      if(!res) {
        settingsModel.terserConfiguration = "";
        submitSettings();
        return;
      }
      try{
        settingsModel.terserConfiguration = JSON.parse(res);
        submitSettings();
      }
      catch(e){
        alertDialog("invalid JSON. terserConfiguration setted to <pre><code>" +
          JSON.stringify(settingsModel.terserConfiguration,null,2)
          + "</code></pre>");
      }
    }, e => console.warn(e))
}