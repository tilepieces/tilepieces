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