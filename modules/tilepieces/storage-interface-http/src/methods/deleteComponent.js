function deleteComponent(newSettings){
    return new Promise(async (resolve,reject)=>{
        var headers = {};
        if(tilepieces.currentProject)
            headers['current-project'] = tilepieces.currentProject;
        fetch(`${API.deleteComponent}`,{
            method: "POST",
            headers,
            body: JSON.stringify(newSettings)
        }).then(res=>{
            handleResult(res)
                .then(r=>resolve(r))
                .catch(e=>reject(e))
        },reject);
    })
}