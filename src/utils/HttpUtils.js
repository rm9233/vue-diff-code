import Config from '../config/Config';
import http from "http";
import url from "url";

let makePackage = (uri1,uri2,method,params,header,jsonStr)=>{
  let p = mPackage(params);
  let h = mPackage(header);
  return JSON.stringify({
    uri1:uri1,
    uri2:uri2,
    method:method,
    params:p,
    header:h,
    body:jsonStr
  })
}


let mPackage = (arr)=>{
  let a = [];
  for(let i in arr){
    if(arr[i].key!=""||arr[i].value!=""){
      a.push({
        key:arr[i].key,
        value:arr[i].value
      })
    }
  }
  return a;
}

export default {
  send(uri1,uri2,method,params,header,jsonStr,callback) {
    let data = makePackage(uri1,uri2,method,params,header,jsonStr);
    console.log(data);
    let option = {
      hostname: url.parse(Config.Host).hostname,
      path: "/proxy",
      port: Config.proxyProt,
      method: "post",
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
      }
    }

    var req = http.request(option, (response) => {
      var body = '';
      response.on('data', function (data) {
        body += data;
      });

      response.on('end', function () {
        console.log(body);
        callback(body);
      })
    });
    req.write(data);
    req.end();

  }
}
