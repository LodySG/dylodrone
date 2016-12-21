var Droneserver = require('./droneserver');
var Droneclient = require('./droneclient');
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var last_action_date = Date.now();
var isControlled = false;
var hostDrone = "localhost";
var serial = "/dev/ttyUSB0";
var baud = 115200;

var portWeb = 8090;
var portDrone = 3002;

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.render(__dirname + '/index.html');
});

var droneserver = new Droneserver(portDrone);
var droneclient = new Droneclient(hostDrone,portDrone,serial,baud);

setTimeout(() => {
    setInterval(() => {
        console.log(droneserver.getAttitude()); 
    }, 100);
}, 2000);

io.sockets.on('connection', (socket) => {
    socket.on('throttle', (data) => {
        /*
        var rc = {   
                    roll: 1500,
                    pitch: 1500,
                    yaw: 1500,
                    throttle: data.throttle,
                    aux1: 1500,
                    aux2: 1500,
                    aux3: 1500,
                    aux4: 1500 
                };
        /*
        var rc = {};   
        rc.roll = 1500;
        rc.yaw = 1500;
        rc.throttle = throttle;
        rc.aux1 = 1500;
        rc.aux2 = 1500;
        rc.aux3 = 1500;
        rc.aux4 = 1500;
        
        var rc = {};
        rc["roll"] = 1500;
        rc["yaw"] = 1500;
        rc["throttle"] = data.throttle;
        rc["aux1"] = 1500;
        rc["aux2"] = 1500;
        rc["aux3"] = 1500;
        rc["aux4"] = 1500;
        
        console.log(rc);
        droneserver.setRc(rc);
        */
        droneserver.getDevice();
    });
});

server.listen(portWeb, () => console.log("app launched -> localhost:" + portWeb));