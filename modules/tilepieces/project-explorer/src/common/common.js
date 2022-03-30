const opener = window.opener ? window.opener : window.parent;
const storageIntegration = opener.storageInterface;
const allowedExtToEdit = ["js", "mjs", "json", "html", "htm", "css", "ts", "svg", "xml","txt"];
const app = opener.tilepieces;
const dialog = opener.dialog;
const confirmDialog = opener.confirmDialog;
const alertDialog = opener.alertDialog;
const promptDialog = opener.promptDialog;
const tooltipEl = document.getElementById("project-menu-tooltip");
const editSourceCode = document.getElementById("edit-source-code");
const tooltipCopy = document.getElementById("project-tree-copy");
const tooltipCut = document.getElementById("project-tree-cut");
const tooltipPaste = document.getElementById("project-tree-paste");
const openInNewWindow = document.getElementById("open-in-new-window");
const projectTreeAddFileWrapper = document.getElementById("project-tree-add-file-wrapper");
const ptframe = document.getElementById("project-tree-element");
const projectWrapper = document.getElementById("project-wrapper");
const projectTreeWrapper = document.getElementById("project-tree-wrapper");
const buttonCreateFile = document.getElementById("project-tree-create-file");
const fileList = document.getElementById("project-tree-file-list");
const buttonCreateDir = document.getElementById("project-tree-create-dir");
const buttonAddFile = document.getElementById("project-tree-add-file");
const buttonDeleteFile = document.getElementById("project-tree-delete");
const buttonRefactorFile = document.getElementById("project-tree-refactor");
const newFileDialog = document.getElementById("new-file-form-template");
let pt;