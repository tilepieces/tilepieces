/*
    'read' read the file associated with path passed
    the path is concatenated with the mapped 'projectName' declared in the recent 'create' method
    if path is a file,a text representation will be returned ( front art can modify only text files )
    if path is a directory, a json type schema (@see 'create') will be returned
 * */
function read(path,component,project){
    return new Promise(async (resolve,reject)=> {
        path = path.replace(/&/g,"%26");
        console.log("[frontart storage => 'read']",path);
        var headers = {};
        if(tilepieces.currentProject)
            headers['current-project'] = tilepieces.currentProject;
        fetch(`${API.read}&path=${path}${component ? `&component=${component}` : ``}`+
            `${project ? `&project=${project}` : ``}`,{
                headers
            }).then(async res=>{
            console.log(res.headers);
            var isDirectoryRapresentation = res.headers.has('tilepieces-directory');
            if(res.ok && !isDirectoryRapresentation && isTextMimeType(res.headers.get('Content-Type')))
                resolve(await res.text());
            else if(res.ok && !isDirectoryRapresentation)
                resolve(await res.blob());
            else if(res.ok) // isDirectoryRapresentation
                resolve(await res.json());
            else
                reject(await res.json());
        },reject);
    })
}