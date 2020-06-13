

var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });

console.log(server);


io.origins([
    'http://localhost:9000', 'https://localhost:9000', 'ws://localhost:9000',
    'http://127.0.0.1:9000', 'https://127.0.0.1:9000', 'ws://127.0.0.1:9000',
    'http://localhost:9002', 'https://localhost:9002', 'ws://localhost:9002',
    'http://127.0.0.1:9002', 'https://127.0.0.1:9002', 'ws://127.0.0.1:9002']);
io.on('connect', (socket) => {
    console.log('accepted...', socket.id);

    var try_times = 0;
    var interval_xx = null;

    console.log('connect');

    interval_xx = setInterval(()=> {
        if (try_times > 2) {
            clearInterval(interval_xx);
            socket.emit('state_control_stopped');
            return;
        }
        socket.emit('fan_request', {'fan_speed': 'high', 'duration': 1000});
        console.log(try_times, new Date(Date.now()).toUTCString());
        try_times ++;
    }, 1000);

    socket.on('start_state_control', (id, msg) => {
        console.log('start_state_control');

        var try_times = 0;
        var interval_xx = null;

        interval_xx = setInterval(()=> {
            if (try_times > 2) {
                clearInterval(interval_xx);
                socket.emit('state_control_stopped');
                return;
            }
            socket.emit('fan_request', {'fan_speed': 'high', 'duration': 1000});
            console.log(try_times, new Date(Date.now()).toUTCString());
            try_times ++;
        }, 1000);
    });
});
app.set('port', 9002);



server.listen(app.get('port'), function () {
    console.log('----- SERVER STARTED -----');
});


