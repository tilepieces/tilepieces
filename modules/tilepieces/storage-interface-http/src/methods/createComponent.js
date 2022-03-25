function createComponent(newSettings,files = []){
    return new Promise(async (resolve,reject)=>{
        var headers = {};
        if(tilepieces.currentProject)
            headers['current-project'] = tilepieces.currentProject;
        var formData = new FormData();
        formData.append("newSettings", JSON.stringify(newSettings));
        files.forEach(file=>{
            formData.append(file.path, file.blob);
        });
        fetch(`${API.createComponent}`,{
            method: "POST",
            headers,
            body:formData
        }).then(res=>{
            handleResult(res)
                .then(r=>resolve(r))
                .catch(e=>reject(e))
        },reject);
    })
}