function getSettings(){
    return new Promise(async (resolve,reject)=>{
        var headers = {};
        if(tilepieces.currentProject)
            headers['current-project'] = tilepieces.currentProject;
        fetch(`${API.settings}`,{
            headers
        }).then(res=>{
            handleResult(res)
                .then(r=>resolve(r))
                .catch(e=>reject(e))
        },reject);
    })
}