function search(dir,match = null,rgFile=null,componentName = null,projectName = null){
    return new Promise(async (resolve,reject)=>{
        var headers = {'Content-Type': 'application/json'};
        if(tilepieces.currentProject)
            headers['current-project'] = tilepieces.currentProject;
        fetch(`${API.search}`,{
            method: "POST",
            headers,
            body: JSON.stringify({dir,match,rgFile,componentName,projectName})
        }).then(res=>{
            handleResult(res)
                .then(r=>resolve(r))
                .catch(e=>reject(e))
        },reject);
    })
}