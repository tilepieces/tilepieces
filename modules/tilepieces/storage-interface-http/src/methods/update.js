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