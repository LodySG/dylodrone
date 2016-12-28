$(function(){

/*
    ARM : aux[0] => 2000
    ANGLE : aux[1] => 1100
    HORIZON : aux[1] => 1500
    BARO : aux[2] => 1500
*/


    var roll = 1500;
    var pitch = 1500;
    var yaw = 1500;
    var throttle = 1000;
    var aux = [1000, 1100, 1000, 1000];

    var mid = 1500;
    var min = 1000;
    var max = 2000;

    var initialPos = null;

    function is_touch_device() {
        return 'ontouchstart' in window  || navigator.maxTouchPoints;
    }

    var socket = io();

    nx.colorize("fill", nx.randomColor());
    nx.colorize("border", nx.randomColor());
    nx.colorize("accent", nx.randomColor());

    setTimeout(function() {
        thro.set({value: 0});
        yw.set({value: 0});
        
        thro.mode = "relative";

        thro.on("*", (data) => {
            throttle = nx.prune(nx.scale(data.value, 0, 1, min, max));
        });

        yw.on("*", (data) => {
            yaw = nx.prune(nx.scale(data.value, -1, 1, min, max));
        });

        rollpi.on("*", (data) => {
                        
            if(data.press == 1)
                initialPos = {x: data.x, y: data.y};
            
            if(initialPos !== null)
            {
                console.log({x: (data.x - initialPos.x),y: (initialPos.y - data.y)});
                roll = nx.prune(nx.scale(data.value, -1, 1, min, max));
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
    /*
    socket.on("status", (data) => {
        console.log(data);
    });
    */
});