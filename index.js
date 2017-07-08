
var express = require('express');
var server = express();
var http = require('http').Server(server);

server.get('/', (req, res) => {
	res.send("Hellos");
});

http.listen(8080);
