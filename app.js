/*
	Load the express framework which handles network requests
*/

var express     = require('express'),
	app 		= express.createServer(),
	views 		= require('./views'),
	io 			= require('socket.io').listen(app),
	sockets 	= require('./sockets');


/*
	Listen to port 80 when on server or port 5000	
*/

app.listen(process.env.PORT || 5000);
console.log('App started.')

app.use(express.static(__dirname + '/static'));
io.set('log level', 1);
io.sockets.on('connection', function(socket) {
	sockets.connection(socket, io)
});