const opener = window.opener || window.parent || window;
const openerParent = opener.opener || opener.parent || opener;
const app = openerParent.tilepieces;
const htmlMatch = app.core.htmlMatch;
const appView = document.getElementById("app-view");
let globalModel = {
  rows: 3,
  columns: 3,
  caption: false,
  theader: false,
  tfooter: false,
  disabled: "disabled",
  deactivated: true,
  target: null,
  tableTarget: null
};
let t = new openerParent.TT(appView, globalModel);