/*
window.addEventListener("window-popup-open",async e=>{
    var dockableElement = e.detail.dockableElement;
    var dockableElementIframe = e.detail.dockableElementIframe;
    var newWindow = e.detail.newWindow;
    var iframeWindow = dockableElementIframe.contentDocument.defaultView;
    if(!ptframe)
        return;
    var read = await opener.storageInterface.read("");
    var openerPT = dockableElementIframe.contentDocument.defaultView.pt;
    if(openerPT){
        openerPT.removeAllSelections();
        var newPtFrame = document.importNode(dockableElementIframe.contentDocument.defaultView.pt.target,true);
        pt = new ProjectTree(ptframe, read.value);
        openerPT && ptframe.replaceChild(newPtFrame.children[0],ptframe.children[0]);
        ptInterface(pt);
    }
});
window.addEventListener("window-popup-close",e=>{
    var dockableElement = e.detail.dockableElement;
    var dockableElementIframe = e.detail.dockableElementIframe;
    var newWindow = e.detail.newWindow;
    if(!ptframe)
        return;
    var imp = document.adoptNode(ptframe,true);
    document.body.appendChild(imp);
    if(newWindow.pt) {
        newWindow.pt.removeAllSelections();
        var newPtFrame = document.importNode(newWindow.pt.target, true);
        ptframe.replaceChild(newPtFrame.children[0], ptframe.children[0]);
    }
    //ptInterface(opener.frontartApp.currentProject,pt);
});
    */