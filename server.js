/*Oxford Dictionary API - created by www.hybridappzone.com*/
var express = require('express');
var app = express();
var request = require('request');
var https = require('https');
var rootCas = require('ssl-root-cas/latest').inject();
https.globalAgent.options.ca = rootCas;

app.get('/',function (req, res){
  res.sendFile('views/index.html' , { root : __dirname});
});

app.post('/search',function (searchReq, searchRes){
  var searchInput=""; var searchInputVal="";
   searchReq.on('data', function (data) {
      searchInput += data;
      console.log("searchInput "+searchInput);
      searchInput = searchInput.split("=");
      searchInputVal = searchInput[1];

  console.log("searchInputVal"+searchInputVal);
  var postRequest = {
      host: "od-api.oxforddictionaries.com",
      path: "/api/v1/entries/en/"+searchInputVal,
      port: "443",
      method: "GET",
      rejectUnauthorized: false,
      headers: {
          'Content-Type': 'text/html',
          'app_id': process.env.APPID,
          'app_key': process.env.APPKEY,
          'Content-Length': Buffer.byteLength(searchInputVal)
      }
  };

  var request = https.request(postRequest, function(response){
    var searchData = "";
    response.on( "data", function(data) { searchData = searchData + data;} );
    response.on( "end", function(data) {
      console.log("searchData"+ searchData);
      searchRes.end(searchData);
    });
  });


  request.on('error', function(error) {
    console.log('problem with request: ' + error.message);
  });

  request.write(JSON.stringify(searchInputVal));
  });
});

var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});
