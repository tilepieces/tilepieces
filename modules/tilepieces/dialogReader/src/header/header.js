const paginationItems = 10;
const typeEnum = {
  "audio" : ".mp3,.ogg,.wav",
  "video" : ".mp4,.ogg,.webm",
  "img" : ".apng,.gif,.jpg,.jpeg,.avif,"+
  ".jfif,.pjpeg,.pjp,.png,.svg,.webp,.bmp,.ico,.cur",
  "fonts" : ".otf,.ttf,.svg,.woff,.woff2,.eot"
};
const searchEnum = {
  "audio" : "**/*(*.mp3|*.ogg|*.wav)",
  "video" : "**/*(*.mp4|*.ogg|*.webm)",
  "img" : "**/*(*.apng|*.gif|*.jpg|*.jpeg|*.avif|"+
    "*.jfif|*.pjpeg|*.pjp|*.png|*.svg|*.webp|*.bmp|*.ico|*.cur)",
  "fonts" : "**/*(*.otf,*.ttf,*.svg,*.woff,*.woff2,*.eot)"
}
let type;
let template = document.getElementById("tilepieces-search-template");
let t;
let evs;
let selected;
let dialogObj;
let pagination;
let globalModel = {
  pagination : null,
  resources : [],
  disabled:"disabled"
};
let docPath;
let inputFile,filePathInput,fileButtonSave,fileSearch;