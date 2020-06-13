

// commonjs style require
const io = require('socket.io-client');
// or use import style:
// import io from 'socket.io-client';



class WebsocketConn {
    constructor({url, room_id, state}) {

        this.url = url;
        this.room_id = room_id;
        this.state = state;
        this.socket = null;
        this.socket_option = {
            query: {
                room_id: this.room_id,
              },
            transports: ['websocket']
        };
    }

    // 请求断开
    disconnect() {
        this.socket.emit('disconnect');
    }

    // 重试
    on_attemping_reconnect() {
        this.socket.io.opts.transports = ['polling', 'websocket'];
    }
    // 连接时
    on_connect() {
        console.log('connected');
    }

    // 断开时
    on_disconnect() {
        console.log('disconnected');
        this.socket = null;
    }

    // 开始送风
    on_start_supply(fan_speed, mode) {
        console.log('start_supply', new Date(Date.now()).toUTCString(), this.state, fan_speed, mode);
        this.state.current_fan_speed = fan_speed;
        this.state.current_mode = mode;
        if (this.state.current_mode == 'cool') {
            this.state.current_mode_c = -1;
        } else {
            this.state.current_mode_c = 1;
        }
    }

    // 送一次风
    on_supply_once(time_delta) {
        console.log('supply_once', new Date(Date.now()).toUTCString(), time_delta);
    }
  
    // 停止送风
    on_stop_supply() {
        console.log('stop_supply', new Date(Date.now()).toUTCString(), );
        this.state.current_fan_speed = 'non';
    }

    connect() {
        this.socket = io(this.url, this.socket_option);
        this.socket.on('reconnect_attempt', () => this.on_attemping_reconnect());
        this.socket.on('connect', () => this.on_connect());
        this.socket.on('disconnect', () => this.on_disconnect());
        this.socket.on('start_supply', (fan_speed,mode) => this.on_start_supply(fan_speed,mode));
        this.socket.on('supply_once', (duration) => this.on_supply_once(duration));
        this.socket.on('stop_supply', () => this.on_stop_supply());
    }
}

// global data

const url = 'ws://localhost:9002';
const room_id = 1;

var state = {
    current_temperature: 22.0,
    current_fan_speed: 'low',
    current_mode: 'heat',
    current_mode_c: 1,
}

// show code

console.log({url, room_id, state});

var conn = new WebsocketConn({url, room_id, state});

setInterval(() => {
    if (state.current_fan_speed == 'high') {
        state.current_temperature += state.current_mode_c / 15;
    } else if (state.current_fan_speed == 'mid') {
        state.current_temperature += state.current_mode_c / 20;
    } else if (state.current_fan_speed == 'low') {
        state.current_temperature += state.current_mode_c / 25;
    } else {
        state.current_temperature += 1 / 5 * Math.random() - 0.1;
    }
}, 1000);

setInterval(() => {
    document.getElementById('app').innerHTML = `
<p>Temperature: ${state.current_temperature}</p>
<p>FanSpeed: ${state.current_fan_speed}</p>
<p>Mode: ${state.current_mode}</p>
`;
}, 1000);

conn.connect();


setTimeout(() => {
    conn.disconnect();
}, 5000);

