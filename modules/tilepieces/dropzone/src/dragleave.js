function dragLeave(e){
    e.preventDefault();
    var target = e.target;
    var dropzone = target.closest("[data-dropzone]");
    if(dropzone)
        dropzone.classList.remove("ondrop");
}