window.storageInterface = {
    create,
    read,
    update,
    delete : del,
    copy,
    getSettings,
    setSettings,
    search,
    createComponent,
    deleteComponent
};
if(window.tilepieces) {
    window.tilepieces.storageInterface = storageInterface;
    window.tilepieces.imageTypeProcess = 0;
}