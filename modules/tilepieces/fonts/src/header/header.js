const opener = window.opener || window.parent;
let app = opener.tilepieces;
const appView = document.getElementById("fonts");
const addFont = document.getElementById("add-font");
const urlRegex = /url\([^)]*\)/;
const localRegex = /local\([^)]*\)/;
const formatRegex = /format\([^)]*\)/;
/*
opener.addEventListener("edit-page",e=>{
    if(!e.detail)
        t.set("",{isVisible : false});
});*/
opener.addEventListener("edit-mode", e => {
  if (!app.editMode)
    t.set("", {isVisible: false});
});
/*
opener.addEventListener("html-rendered",e=>{
    t.set("",{isVisible : false});
});*/
let model = {};
let t;
tilepieces_tabs({
  el: document.getElementById("font-tabs"),
  noAction: true
});
//autocomplete(appView);
if (app.core)
  assignModel({detail: app.core});
opener.addEventListener("cssMapper-changed", assignModel);