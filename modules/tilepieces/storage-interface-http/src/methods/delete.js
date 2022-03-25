/*
 'delete' delete a path
 if path == "", the project will be erase.
 }
 * */
function del(path = "",project=null){
    return new Promise(async (resolve,reject)=>{
        var headers = {};
        if(tilepieces.currentProject)
            headers['current-project'] = tilepieces.currentProject;
        path = path.replace(/&/g,"%26");
        console.log("[frontart storage => 'delete']",path);
        fetch(`${API.delete}&path=${path}${project ? `&project=${project}` : ""}`,{
            headers
        }).then(res=>{
            handleResult(res)
              .then(r=>resolve(r))
              .catch(e=>reject(e))
        },reject);
    })
}