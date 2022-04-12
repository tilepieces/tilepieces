tilepieces.setFrame = function (URL, htmltext,noSetHistory = false) {
  if(Object.keys(tilepieces.toUpdateFileObject).length){
    dialog.open("Files are finishing to be updated...", true);
    return setTimeout(()=>{
      tilepieces.setFrame(URL, htmltext);
    },250)
  }
  else
    dialog.dialogElement.classList.contains("open") && dialog.close()
  tilepieces.frame.removeEventListener("load", tilepieces.loadFunction);
  if(!URL){
    tilepieces.frame.src = "";
    disconnectFrame({"error":"setFrame called with empty URL"});
    return;
  }
  tilepieces.loadFunction = async function load(e) {
    console.log("[tilepieces setFrame load called]");
    if (!tilepieces.frame.contentDocument) {
      disconnectFrame(e,"impossible fetch document");
      return;
    }
    if (tilepieces.frame.contentDocument == tilepieces.core?.currentDocument)
      return;
    var framePath = tilepieces.frame.contentDocument.location.pathname;
    var pathname = decodeURI(framePath);
    var resourcePathToRemove = tilepieces.frameResourcePath();
    resourcePathToRemove = resourcePathToRemove.startsWith("/") ? resourcePathToRemove : "/" + resourcePathToRemove;
    if(!pathname.startsWith(resourcePathToRemove)){
      var errorString = `pathname ${pathname} doesn't start with ${resourcePathToRemove}`;
      disconnectFrame(errorString,errorString);
      return;
    }
    if (!htmltext) {
      try {
        var html = await fetch(pathname,{
          headers: {'current-project':tilepieces.currentProject}
        });
        if (html.status != 200)
          throw html;
        htmltext = await html.text();
      } catch (e) {
        disconnectFrame(e)
        return;
      }
    }
    pathname = pathname.replace(resourcePathToRemove, "");
    tilepieces.core = await tilepiecesCore().init(tilepieces.frame.contentDocument, htmltext);
    tilepieces.currentPage = {
      path: pathname[0] == "/" ? pathname.slice(1) : pathname,
      fileText: htmltext
    };
    htmltext = "";
    var name = pathname.split("/").pop();
    tilepieces.fileSelected = Object.assign({
      mainFrameLoad: true,
      file: tilepieces.currentPage.fileText,
      name,
      ext: name.includes(".") ?
        name.split('.').pop() :
        null
    }, tilepieces.currentPage);
    //window.dispatchEvent(new CustomEvent("file-selected",{detail:tilepieces.fileSelected}));
    window.dispatchEvent(
      new CustomEvent("html-rendered", {
          detail: {
            htmlDocument: tilepieces.frame.contentDocument
          }
        }
      )
    );
    menuBarTrigger.classList.remove("no-frame");
    // unload seems not work
    tilepieces.frame.contentWindow.addEventListener("beforeunload", e => {
      if (tilepieces.multiselected)
        tilepieces.destroyMultiselection();
      if (tilepieces.elementSelected)
        tilepieces.core.deselectElement();
      if (tilepieces.editMode == "selection")
        selectionTrigger.click();
      menuBarTrigger.classList.add("no-frame");
      window.dispatchEvent(new Event("frame-unload"))
    });
    if (tilepieces.project && tilepieces.project.lastFileOpened != pathname&& tilepieces.storageInterface?.setSettings) {
      tilepieces.project.lastFileOpened = pathname;
      tilepieces.storageInterface.setSettings({ // no await
        "projectSettings": {
          "lastFileOpened": pathname
        }
      });
    }
    document.title = `${tilepieces.project ? `${tilepieces.project.name} - ` : ``}${pathname} - tilepieces`;
    if(tilepieces.project) {
      var searchParams = new URLSearchParams(location.search);
      var projectSearchParam = searchParams.get('project');
      var historyMethod = projectSearchParam != tilepieces.project?.name ? "pushState" : "replaceState";
      history[historyMethod]({
        project: tilepieces.project,
        pathname
      }, document.title, "?project=" + encodeURIComponent(tilepieces.project.name) + "&path=" + encodeURIComponent(pathname));
    }
  }
  tilepieces.frame.addEventListener("load", tilepieces.loadFunction);
  if (tilepieces.sandboxFrame)
    tilepieces.frame.setAttribute("sandbox", "allow-same-origin");
  else
    tilepieces.frame.removeAttribute("sandbox");
  var frameRes = tilepieces.frameResourcePath();
  tilepieces.frame.src = (frameRes ? tilepieces.utils.paddingURL(frameRes) + URL : URL).replace(/\/+/g,"/");
};
