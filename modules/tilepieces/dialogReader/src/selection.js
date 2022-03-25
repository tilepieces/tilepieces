function selection(e){
  var target = e.target;
  if(target.closest(".upload-file-mask"))
    return;
  var figure = target.closest("figure");
  var button = target.nodeName == "BUTTON";
  if(figure){
    selected && selected.classList.remove("sel");
    selected = figure;
    selected.classList.add("sel");
    t.set("disabled","");
  }
  if(button && selected){
    dialogObj.dialog.removeEventListener("click",selection);
    dialog.close();
    var selectedValue = selected.dataset.value.replace(tilepieces.frameResourcePath() + "/","");
    evs.dispatch("submit",tilepieces.relativePaths ?
      tilepieces.utils.getRelativePath(docPath || tilepieces.utils.getDocumentPath(),selectedValue) :
      selectedValue[0] == "/" ? selectedValue : "/" + selectedValue
    );
  }
  if(typeof target.dataset.prev == "string" ||
    typeof target.dataset.next == "string"){
    var pointer = target.dataset.prev == "" ?
    globalModel.pagination.pointer-paginationItems :
    globalModel.pagination.pointer+paginationItems;
    var page = target.dataset.prev == "" ? globalModel.pagination.page-1 :
    globalModel.pagination.page+1;
    globalModel.resources = globalModel.pagination.total.slice(pointer,pointer + paginationItems);
    globalModel.pagination = {
      total : pagination.total,
      pages : globalModel.pagination.pages,
      page,
      pointer
    };
    t.set("",globalModel);
    globalModel =t.scope;
    selected && selected.classList.remove("sel");
  }
}