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

app.get('/sequencer', function(req, res){
    res.render('sequencer.html');
});

app.get('/scheduler', function(req, res){
    res.render('scheduler.html');
});

app.use(function(req, res) {

    res.send('unknown route ' + req.url);
});

server.listen(12345);
