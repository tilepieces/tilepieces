const refreshTrigger = document.getElementById("refresh-trigger");
const selectionTrigger = document.getElementById("selection-trigger");
const contenteditableTrigger = document.getElementById("contenteditable-trigger");
const menuTrigger = document.getElementById("menu-trigger");
const menuBar = document.getElementById("menu-bar");
const menuBarTrigger = document.getElementById("menu-bar-trigger");
const targetFrameWrapper = document.getElementById("target-frame-wrapper");
const menuBarsettings = document.getElementById("menu-bar-settings");
const menuBarprojects = document.getElementById("menu-bar-projects");
const menuBarcomponents = document.getElementById("menu-bar-components");
const mobileWrapper = document.getElementById("mobile-wrapper");

const windowsListEl = document.getElementById("window-list");
const dockFrame = document.getElementById("dock-frames");
let frameUIEls = [...dockFrame.querySelectorAll(".panel-element")];
let isMobile = window.innerWidth < 1024;

searchForLastProject();
