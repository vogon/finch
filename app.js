var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(80);

app.use(express.logger());
app.use(express.static(__dirname + '/public'));

