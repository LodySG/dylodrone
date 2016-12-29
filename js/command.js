$(function(){

/*
    ARM : aux[0] => 2000
    ANGLE : aux[1] => 1100
    HORIZON : aux[1] => 1500
    BARO : aux[2] => 1500
*/

    var log = (log) => {console.log(log)};

    var roll = 1500;
    var pitch = 1500;
    var yaw = 1500;
    var throttle = 1000;
    var currentThrottle = 1000;
    var aux = [1000, 1100, 1000, 1000];

    var rollpitchmax = 150;
    var rollpitchmin = -150;

    var seuilyaw = 0.050;

    var mid = 1500;
    var min = 1000;
    var max = 2000;

    var initialTPPos = null;
    var initialRYPos = null;

    function is_touch_device() {
        return 'ontouchstart' in window  || navigator.maxTouchPoints;
    }

    var socket = io();

    nx.colorize("fill", nx.randomColor());
    nx.colorize("border", nx.randomColor());
    nx.colorize("accent", nx.randomColor());

    setTimeout(function() {

        throttlepitch.on("*", (data) => {            
            if(data.press == 1)
                initialTPPos = {x: data.x, y: data.y};
            
            if(data.press == 0){
                initialTPPos = null;
                currentThrottle = throttle;
                pitch = 1500;
                log({throttle: throttle,pitch: pitch});
            }

            if(initialTPPos !== null)
            {
                var tempX = nx.clip((data.x - initialTPPos.x),-150,150);
                var tempY = nx.clip((initialTPPos.y - data.y),-150,150);

                throttletemp = nx.prune(nx.scale(tempY, -150, 150, (0-(min/2)),(min/2)));
                log(throttletemp);
                throttle = nx.clip(currentThrottle + throttletemp, min, max);
                pitch = nx.prune(nx.scale(tempX, -150, 150, min, max));
                log({throttle: throttle,pitch: pitch});
            }
        });

        rollyaw.on("*", (data) => {            
            if(data.press == 1)
                initialRYPos = {x: data.x, y: data.y};
            
            if(data.press == 0){
                initialRYPos = null;
                roll = 1500;
                pitch = 1500;
            }

            if(initialRYPos !== null)
            {
                var tempX = nx.clip((data.x - initialRYPos.x),-150,150);
                var tempY = nx.clip((initialRYPos.y - data.y),-150,150);

                roll = nx.prune(nx.scale(tempX, -150, 150, min, max));
                pitch = nx.prune(nx.scale(tempY, -150, 150, min, max));
                log({roll: roll,pitch: pitch});
            }
        });

        arm.on("*", (data) => {
            if(data.value == 1)
                aux[0] = 2000;
            else
                aux[0] = 1000;
        });

        angleh.on("*", (data) => {
            if(data.value == 1)
                aux[1] = 1100;
            else
                aux[1] = 1500;
        });

        baro.on("*", (data) => {
            if(data.value == 1)
                aux[2] = 1500;
            else
                aux[2] = 1000;
        });

    }, 200);

    setInterval(() => {

        var controller = {
            roll: roll,
            pitch: pitch,
            yaw: yaw,
            throttle: throttle,
            aux: aux
        };

        socket.emit('command', controller);

        //console.log(controller);
    },100);
    
    setInterval(() => {

        var controller = {
            roll: roll,
            pitch: pitch,
            yaw: yaw,
            throttle: throttle,
            aux: aux
        };

        log(controller);

        //console.log(controller);
    },3000);

});