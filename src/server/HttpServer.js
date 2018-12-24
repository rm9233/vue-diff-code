var express = require('express')
var path = require('path');
var http = require('http');
var https = require('https');
var url = require('url');
var bodyParser = require('body-parser');//用于req.body获取值的
var FormData = require('form-data');
var app = express();
var httpRes;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let cros = (res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
}

let url1res = "";
let index = 0;

let mPort = (protocol)=>{
    if(protocol == "http://"){
      return 80;
    }else{
      return 443;
    }
}

let client = (req, uri) => {
  let h = null;
  let exp = /^(http:\/\/|https:\/\/)?(.[^\/]+)(\/.*)/;
  let match = uri.match(exp);
  match[1] == "http://" ? h = http : h = https;
  let host = match[1] + match[2];
  let port = mPort(match[1])
  let path1 = match[3];
  return {
    client: h,
    host: host,
    path: path1,
    port: port
  };
}

let mHeader = (req,type) => {
  let i, h, a, len;
  a = req.body.header;
  h = {};
  len = req.body.header.length;
  for (i = 0; i < len; i++) {
    if (a[i].key != "") {

      if(type == 1 && a[i].key == "token1"){
        a[i].key = "Authorization";
      }
      if(type == 2 && a[i].key == "token2"){
        a[i].key = "Authorization";
      }
      if (type == 1 && a[i].key == "env"){
        continue;
      }
      h[a[i].key] = a[i].value;
    }

  }
  return h;
}

let formdata = (req) => {
  let i, a, len, flen, form;
  form = new FormData();
  a = req.body.params;
  flen = 0;
  len = req.body.params.length;
  for (i = 0; i < len; i++) {
    if (a[i].key != "") {
      form.append(a[i].key, a[i].value);
      flen++;
    }
  }
  return {
    form: form,
    len: flen
  };
}

let mOption = (c, req , type) => {
  let method = req.body.method;
  let formobj = formdata(req);
  let jsonstr = req.body.body;
  let from = null;
  let option = {
    hostname: url.parse(c.host).hostname,
    port: c.port || 80,
    path: c.path,
    method: method
  }
  if (formobj.len != 0) {
    from = formobj.form;
    option.headers = from.getHeaders()
    option.from = from;
  } else {
    option.headers = mHeader(req,type);
    if (jsonstr != "") {
      console.log(option.headers);
      option.headers['Content-Type'] = 'application/json; charset=utf-8';
      option.headers['Content-Length'] = Buffer.byteLength(jsonstr);
    }
  }
  return option;
}

let fetch = (clients, options, req, res) => {
  var r = clients[index].client.request(options[index], (response) => {
    let body = '';
    response.on('data', function (data) {
      body += data;
    });

    response.on('end', function () {
      if (index == 0) {
        index = 1;
        url1res = body;
        console.log(body);
        fetch(clients, options, req);
      } else {
        httpRes.send({
          first: url1res,
          second: body
        });
        url1res = "";
        index = 0;
        httpRes.end();
      }
    });

    response.on('error', function () {
      console.log("服务器错误..");
      url1res = "";
      index = 0;
      httpRes.end();
    })
  });

  if (req.body.body != "") {
    r.write(req.body.body);
  }
  r.end();

}

app.post('/proxy', (req, res, next) => {

  cros(res);
  httpRes = res;
  let c1 = client(req, req.body.uri1);
  let c2 = client(req, req.body.uri2);
  let option1 = mOption(c1, req,1);
  let option2 = mOption(c2, req,2);
  //console.log(option1);
  fetch([c1, c2], [option1, option2], req);
})


app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.listen(8081, () => console.log('Example app listening on port 8081!'))
