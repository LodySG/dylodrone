var Device = require('./device');
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var last_action_date = Date.now();
var isControlled = false;
var serial = "/dev/ttyUSB0";
var baud = 115200;

var portWeb = 8090;
var portDrone = 3002;

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.render(__dirname + '/index.html');
});

var device = new Device(serial,baud);

setTimeout(() => {
    setInterval(() => {
        //console.log(droneserver.getAttitude()); 
    }, 100);
}, 2000);

io.sockets.on('connection', (socket) => {
    socket.on('command', (data) => {
        console.log("command : "+data.throttle);        
        //device.setRc(data);
    });
});

server.listen(portWeb, () => console.log("app launched -> localhost:" + portWeb));