(()=>{
function handleResult(res){
    return new Promise(async (resolve,reject)=>{
        if(res.status != 200)
            reject(res);
        var result = await res.json();
        if(result.result == 1)
            resolve(result);
        else
            reject(result);
    })
}
var API = {
    copy : "/?tilepieces-copy",
    create : "/?tilepieces-create",
    delete : "/?tilepieces-delete",
    read : "/?tilepieces-read",
    open : "/?tilepieces-open",
    settings : "/?tilepieces-settings",
    update : "/?tilepieces-update",
    search : "/?tilepieces-search",
    createComponent : "/?tilepieces-component-create",
    deleteComponent : "/?tilepieces-component-delete"
};
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
function isTextMimeType(mimeType){
    return mimeType && (mimeType.startsWith("text/") ||
        mimeType == "application/json" ||
        mimeType == "application/xml" ||
        mimeType.indexOf("+xml")>-1);
}
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

/*
'create' sets server in mapped projectName directory
if projectName directory doesn't exists, create new in workspace
return json type schema of directory , ex :
* {
*   "folder1" : {},
*   "folder2" : {},
*   "file.txt" : "file.txt"
* }
*
* */
function create(projectName){
    return new Promise(async (resolve,reject)=> {
        console.log("[frontart storage => 'create']", projectName);
        projectName = projectName.replace(/&/g,"%26");
        fetch(API.create + "&projectName=" + projectName).then(res=>{
            handleResult(res)
                .then(r=>{
                    tilepieces.currentProject = projectName;
                    resolve(r);
                })
                .catch(e=>reject(e))
        },reject);
    })
}
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
/*
 'update' perform an update of a file.
 if file does not exists, it will be created if the parent path exists. if not, an error is expected
 upObj is structured as follows:
 {
    "path" : the string of path in current project (see @create),
    "value" : File (js constructor) representation of file. File type is important because pass the filename,
    content-type and size
 }
 * */
function update(path,blobFile) {
    return new Promise(async (resolve, reject)=> {
        var headers = {};
        if(tilepieces.currentProject)
            headers['current-project'] = tilepieces.currentProject;
        console.log("[frontart storage => 'update']", path,blobFile);
        var formData = new FormData();
        formData.append("path", path);
        blobFile && formData.append("file", blobFile);
        fetch(API.update,{
            method: "POST",
            body: formData,
            headers
        }).then(res=>{
            handleResult(res)
                .then(r=>{
                    var isDirectory= res.headers.has('tilepieces-directory');
                    window.dispatchEvent(new CustomEvent("tilepieces-file-updating",{detail:{
                        path,
                        isDirectory
                    }}));
                    resolve(r);
                })
                .catch(e=>reject(e))
        },reject);
    })
}

})();