function copy(path,newPath,move = false) {
    return new Promise(async (resolve,reject)=> {
        var headers = {};
        if(tilepieces.currentProject)
            headers['current-project'] = tilepieces.currentProject;
        path = path.replace(/&/g,"%26");
        newPath = newPath.replace(/&/g,"%26");
        fetch(`${API.copy}&path=${path}` +
            `&newPath=${newPath}` +
            `${move ? `&move=true` : ``}`,{
            headers
            })
            .then(res=>{
                handleResult(res)
                .then(r=>{
                        var newPathSplitted = newPath.split("/");
                        newPathSplitted.pop();
                        window.dispatchEvent(new CustomEvent("tilepieces-file-updating",{detail:{
                            path:newPathSplitted.join("/"),
                            isDirectory:true
                        }}));
                        resolve(r)
                    })
                .catch(e=>reject(e))
        },reject);
    })
}
