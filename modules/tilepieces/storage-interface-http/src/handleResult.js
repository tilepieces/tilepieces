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