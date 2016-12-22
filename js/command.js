$(function(){

    var roll = 1500;
    var pitch = 1500;
    var yaw = 1500;
    var throttle = 1500;
    var aux = [1500, 1500, 1500, 1500];

    var mid = 1500;
    var min = 0;
    var max = 1850;

    function is_touch_device() {
        return 'ontouchstart' in window  || navigator.maxTouchPoints;
    }

    var socket = io();
    /*
    nx.colorize("fill", "#F3368D");
    nx.colorize("border", "#FFC468");
    nx.colorize("accent", "#FFF7CA");
    */
    /*
    nx.colorize("fill", "#FFC468");
    nx.colorize("border", "#FFC468");
    nx.colorize("accent", "#FFF7CA");
    */

    nx.colorize("fill", nx.randomColor());
    nx.colorize("border", nx.randomColor());
    nx.colorize("accent", nx.randomColor());

    setTimeout(function() {
        thro.set({value: 0});
        thro.mode = "relative";

        left.on("*", (data) => {
            console.log(data);
            $("#deltaleft").html("deltaleft : " + left.deltaMove.x + " " + left.deltaMove.y);
        });

        right.on("*", (data) => {
            console.log(data);
            $("#deltaright").html("deltaright : " + right.deltaMove.x + " " + right.deltaMove.y);
        });

        thro.on("*", (data) => {
            throttle = nx.prune(nx.scale(data.value, 0, 1, mid, max));
        });
    }, 100);

    setInterval(() => {
        socket.emit('command', {
            roll: roll,
            pitch: pitch,
            yaw: yaw,
            throttle: throttle,
            aux: aux
        });
    },400);
});