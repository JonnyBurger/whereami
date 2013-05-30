var	coords 	= require('./resources/coords'),
    _       = require('underscore');
exports.connection = function (socket, io) {
	socket.on('get-random-coordinates', function() {
		socket.emit('random-coordinates', { 
			coordinates: coords.coordinates, 
			remaining:   coords.remaining() ,
            round:       coords.round
		});
        if (coords.newround) {
            io.sockets.emit('new-round', { winner: createLeaderboard()[0]});
            var users = _.pairs(exports.room.users);
            _.each(users, function (kv) {
                var id = kv[0];
                var info = kv[1];
                info.points = 0;
                exports.room.users[id] = info;
                io.sockets.emit('leaderboard', createLeaderboard());
            });
        }
	});
	socket.on('marker-set', function (data) {
		function inRange(x, min, max) {
            return (min <= x && x <= max);
        };
        function getPoints(data) {
        	if (inRange(data.distance, 1, 2)) {
        	  return 10000;
        	} else if (inRange(data.distance, 3, 10)) {
        	  return 7000;
        	} else if (inRange(data.distance, 11, 50)) {
        	  return 4000;
        	} else if (inRange(data.distance, 51, 200)) {
        	  return 3000;
        	} else if (inRange(data.distance, 201, 500)) {
        	  return 2000;
        	} else if (inRange(data.distance, 501, 800)) {
        	  return 1000;
        	} else if (inRange(data.distance, 801, 1300)) {
        	  return 500;
        	} else if (inRange(data.distance, 1301, 1600)) {
        	  return 400;
        	} else if (inRange(data.distance, 1601, 2300)) {
        	  return 300;
        	} else if (inRange(data.distance, 2301, 2800)) {
        	  return 200;
        	} else if (inRange(data.distance, 2801, 3200)) {
        	  return 100;
        	} else if (inRange(data.distance, 3200, 4500)) {
        	  return 50;
        	} else if (inRange(data.distance, 4501, 6000)) {
        	  return 25;
        	} else {
        	  return 0;
        	};
        }
        var receivedPoints = getPoints(data)
        if (exports.room.users[socket.id].points != undefined) {
            exports.room.users[socket.id].points += receivedPoints;
        }
        socket.emit('get-points', {
        	points: receivedPoints
        });
        io.sockets.emit('leaderboard', createLeaderboard());
	});
    socket.on('register', function (data) {
        exports.room.users[socket.id] = {
            points: 0,
            name: data.name
        }
        socket.emit('registered', {id: socket.id});
        io.sockets.emit('leaderboard', createLeaderboard());
    });
    socket.on('disconnect', function() {
        delete exports.room.users[socket.id]
    });
}
exports.room = {
    users: {

    }
}
function createLeaderboard() {
    return _.sortBy(
        _.pairs(exports.room.users), function (user) {
            return user[1].points;
        }
    ).reverse();
}