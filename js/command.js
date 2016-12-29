$(function(){

/*
    ARM : aux[0] => 2000
    ANGLE : aux[1] => 1100
    HORIZON : aux[1] => 1500
    BARO : aux[2] => 1500
*/

    var log = (log) => {console.log(log)};

    var mid = 1500;
    var min = 1000;
    var max = 2000;
    var seuil = 30;
    var maxPixVar = 150;
    var minPixVar = 0 - maxPixVar;

    var roll = mid;
    var pitch = mid;
    var yaw = mid;
    var throttle = min;
    var currentThrottle = min;
    var aux = [min, 1100, min, min];

    var initialTPPos = null;
    var initialRYPos = null;

    function is_touch_device() {
        return 'ontouchstart' in window  || navigator.maxTouchPoints;
    }

    // var socket = io();

    nx.colorize("fill", nx.randomColor());
    nx.colorize("border", nx.randomColor());
    nx.colorize("accent", nx.randomColor());

    setTimeout(function() {

        throttleroll.on("*", (data) => {            
            if(data.press == 1)
                initialTPPos = {x: data.x, y: data.y};
            
            if(data.press == 0){
                initialTPPos = null;
                currentThrottle = throttle;
                roll = mid;
                //log({throttle: throttle,pitch: pitch});
            }

            if(initialTPPos !== null)
            {
                var tempX1 = data.x - initialTPPos.x;
                var tempY1 = initialTPPos.y - data.y;
                
                //log({tempX1: tempX1, tempY1: tempY1});
                
                if(tempX1 < seuil && tempX1 > -seuil)
                    tempX1 = 0;
                else{
                    tempX1 = tempX1 >= 0 ? (tempX1-seuil) : (tempX1+seuil)
                }

                if(tempY1 < seuil && tempY1 > -seuil)
                    tempY1 = 0;
                else{
                    tempY1 = tempY1 >= 0 ? (tempY1-seuil) : (tempY1+seuil)
                }

                //log({tempX1After: tempX1, tempY1After: tempY1});
                tempX1 = nx.clip(tempX1,-maxPixVar,maxPixVar);
                tempY1 = nx.clip(tempY1,-maxPixVar,maxPixVar);
                throttletemp = nx.prune(nx.scale(tempY1, -maxPixVar, maxPixVar, -min,min));
                throttle = nx.clip(currentThrottle + throttletemp, min, max);
                roll = nx.prune(nx.scale(tempX1, -maxPixVar, maxPixVar, min, max));
                //log({throttle: throttle,roll: roll});
            }
        });

        pitchyaw.on("*", (data) => {            
            if(data.press == 1)
                initialRYPos = {x: data.x, y: data.y};
            
            if(data.press == 0){
                initialRYPos = null;
                pitch = mid;
                yaw = mid;
            }

            if(initialRYPos !== null)
            {
                var tempX2 = data.x - initialRYPos.x;
                var tempY2 = initialRYPos.y - data.y;
                
                if(tempX2 < seuil && tempX2 > -seuil)
                    tempX2 = 0;
                else{
                    tempX2 = tempX2 >= 0 ? (tempX2-seuil) : (tempX2+seuil)
                }

                if(tempY2 < seuil && tempY2 > -seuil)
                    tempY2 = 0;
                else{
                    tempY2 = tempY2 >= 0 ? (tempY2-seuil) : (tempY2+seuil)
                }

                tempX2 = nx.clip(tempX2,-maxPixVar,maxPixVar);
                tempY2 = nx.clip(tempY2,-maxPixVar,maxPixVar);
                yaw = nx.prune(nx.scale(tempX2, -maxPixVar, maxPixVar, min, max));
                pitch = nx.prune(nx.scale(tempY2, -maxPixVar, maxPixVar, min, max));
                //log({roll: roll,yaw: yaw});
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
        $("#controller_status").html("roll = "+roll+", pitch = "+pitch+", yaw = "+yaw+", throttle = "+throttle+", aux1 = "+aux[0]+", aux2 = "+aux[1]+", aux3 = "+aux[2]+", aux4 = "+aux[3])
        //socket.emit('command', controller);

        //console.log(controller);
    },50);

});