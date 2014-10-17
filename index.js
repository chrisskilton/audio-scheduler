var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);

app.use(express.static(path.join(__dirname)));

app.engine('html', require('hogan-express'));

app.get('/', function(req, res){
    res.render('index.html');
});

server.listen(3000);
