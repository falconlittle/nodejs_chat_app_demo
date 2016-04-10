const http = require('http');
const fs = require('fs');
const WebSocketServer = require('ws').Server;

var srv = http.createServer(function(request, response) {
	fs.open('./public_html' + request.url, 'r', function(err, fd) {
		if (err) throw err;
		
		fs.readFile('./public_html' + request.url, function(err, data) {
			if (err) throw err;
			response.statusCode = 200;
			response.write(data);
			response.end();
		});
	});
}).listen(8080);

var clients = [];

var Client = function(ws) {
	var socket = ws;
	
	socket.on('message', function(chunk) {
		for (i = 0; i < clients.length; i++)
		{
			clients[i].sendMessage(chunk);
		}
	});
	this.sendMessage = function(msg) {
		socket.send(msg);
	};
};

var wss = new WebSocketServer({port: 8081});

wss.on('connection', function(ws) {
	clients.push(new Client(ws));
});
