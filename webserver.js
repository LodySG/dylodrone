var Droneserver = require('./droneserver');
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var last_action_date = Date.now();
var isControlled = false;

var multiwii = require('multiwii');
var Wii = multiwii.Wii;
var wii = new Wii();

multiwii.list().then(function (devices) {
    devices.forEach(function (device) {

        console.log("device.productId : "+device.productId);

        if(device.productId === '0x8036') { // NanoWii 
            wii.connect(device).then(function () {
    
            });
        }
    });
});

var port = 8090;

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.render(__dirname + '/index.html');
});

var drone = new Droneserver();
drone

server.listen(port, () => console.log("app launched -> localhost:" + port));