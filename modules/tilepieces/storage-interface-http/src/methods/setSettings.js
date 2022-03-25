function setSettings(newSettings){
    return new Promise(async (resolve,reject)=>{
        var headers = {'Content-Type': 'application/json'};
        if(tilepieces.currentProject)
            headers['current-project'] = tilepieces.currentProject;
        fetch(`${API.settings}`,{
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