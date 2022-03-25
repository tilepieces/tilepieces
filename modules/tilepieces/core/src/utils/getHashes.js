function getHashes(){
  var hash = location.hash.substring(1);
  return hash.split("&").reduce((acc,v)=>{
    var values = v.split("=");
    acc[decodeURIComponent(values[0])] = decodeURIComponent(values[1]);
    return acc;
  },{})
}