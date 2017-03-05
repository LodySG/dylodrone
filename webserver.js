var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var last_action_date = Date.now();
var isControlled = false;

var five = require('johnny-five');
var board = new five.Board();

var roll = 1500;
var pitch = 1500;
var yaw = 1500;
var throttle = 1000;
var aux1 = 1000;
var aux2 = 1000;
var aux3 = 1000;
var aux4 = 1000;



var portWeb = 8090;

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.render(__dirname + '/index.html');
});

io.sockets.on('connection', (socket) => {

        board.on("ready", function() {

            // init pins
            var roll_pwm = new five.Motor(5);
            var pitch_pwm = new five.Motor(6);
            var yaw_pwm = new five.Motor(9);
            var throttle_pwm = new five.Motor(10);

            var aux1_pwm = new five.Motor(3);
            var aux2_pwm = new five.Motor(11);
//
            setInterval(() => {
                // Mapping vers 2000 -> 255
                var roll_tmp = five.Fn.map(roll, 0, 2000, 0, 255);
                var pitch_tmp = five.Fn.map(pitch, 0, 2000, 0, 255);
                var yaw_tmp = five.Fn.map(yaw, 0, 2000, 0, 255);
                var throttle_tmp = five.Fn.map(throttle, 0, 2000, 0, 255);
                var aux1_tmp = five.Fn.map(aux1, 0, 2000, 0, 255);
                var aux2_tmp = five.Fn.map(aux2, 0, 2000, 0, 255);
                //var aux3_tmp = five.Fn.map(aux3, 0, 2000, 0, 255);
                //var aux4_tmp = five.Fn.map(aux4, 0, 2000, 0, 255);

                // Set pwm levels
                roll_pwm.start(roll_tmp);
                pitch_pwm.start(pitch_tmp);
                yaw_pwm.start(yaw_tmp);
                throttle_pwm.start(throttle_tmp);
                
                // aux
                aux1_pwm.start(aux1_tmp);
                aux2_pwm.start(aux2_tmp);
                //aux3_pwm.start(aux3_tmp);
                //aux4_pwm.start(aux4_tmp);

                console.log('aux1 : '+aux1_tmp);
            }, 100);
        });    

    socket.on('command', (data) => {        
        // receive commands
        roll = parseInt(data.roll);
        pitch = parseInt(data.pitch);
        yaw = parseInt(data.yaw);
        throttle = parseInt(data.throttle);
        aux1 = parseInt(data.aux[0]);
        aux2 = parseInt(data.aux[1]);
        aux3 = parseInt(data.aux[2]);
        aux4 = parseInt(data.aux[3]);
    });
});

server.listen(portWeb, () => console.log("app launched -> localhost:" + portWeb));
