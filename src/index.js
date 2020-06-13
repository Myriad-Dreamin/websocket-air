
const io = require('socket.io-client');


const socket = io('ws://localhost:9002', {transports: ['websocket']});
socket.on('reconnect_attempt', () => {
    socket.io.opts.transports = ['polling', 'websocket'];
});

socket.on('connect', () => {
    console.log('connected');
});

var current_temperature = 22.0;

socket.on('fan_request', (data) => {
    console.log(new Date(Date.now()).toUTCString(), data);
    current_temperature += data.duration / 1000 * 1.0 / 15;
});

socket.on('state_control_stopped', () => {
    console.log('stopped');
    if (current_temperature >= 25.0) { 
        console.log('disconnect');
       socket.emit('disconnect');
    } else {
        socket.emit('start_state_control');
    }
})


setInterval(() => {
    document.getElementById('app').innerHTML = current_temperature;
}, 1000);

