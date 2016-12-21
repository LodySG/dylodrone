$(function(){

    var throttle = 1000;

    function is_touch_device() {
        return 'ontouchstart' in window  || navigator.maxTouchPoints;
    }

    var socket = io();

    //nx.colorize("fill", "#F3368D");
    //nx.colorize("border", "#FFC468");
    //nx.colorize("accent", "#FFF7CA");
    nx.colorize("fill", "#FFC468");
    nx.colorize("border", "#FFC468");
    nx.colorize("accent", "#FFF7CA");

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
            console.log(data);
            if(data.press && data.press == 0)
                thro.set({value: 0.5});
            socket.emit('throttle', {throttle: data.value});
        });
    }, 200);
});