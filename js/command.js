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
    var seuil = 20;
    var seuil_tilt = 0.06;
    var maxPixVar = 100;
    var maxInclinaison = 0.40;
    var moveInitial = null;

    var roll = mid;
    var pitch = mid;
    var yaw = mid;
    var throttle = min;
    var currentThrottle = min;
    var aux = [min, 1100, min, min];
    var acc = 0;

    var initialTYPos = null;
    var initialPRPos = null;

    var socket = io();

    nx.colorize("fill", nx.randomColor());
    nx.colorize("border", nx.randomColor());
    nx.colorize("accent", nx.randomColor());

    setTimeout(function() {

        move.on("*", (data) => {
            var x = nx.prune(data.x,2);
            var y = nx.prune(data.y,2);
            var z = nx.prune(data.z,2);

            if(moveInitial !== null)
            {
                var moveX = nx.prune(x - moveInitial.x,2);
                var moveY = nx.prune(moveInitial.y - y,2);

                if(moveX < seuil_tilt && moveX > -seuil_tilt)
                    moveX = 0;
                else{
                    moveX = moveX >= 0 ? (moveX-seuil_tilt) : (moveX+seuil_tilt);
                }

                if(moveY < seuil_tilt && moveY > -seuil_tilt)
                    moveY = 0;
                else{
                    moveY = moveY >= 0 ? (moveY-seuil_tilt) : (moveY+seuil_tilt);
                }
                moveX = nx.prune(moveX,2);
                moveY = nx.prune(moveY,2);

                moveX = nx.clip(moveX, -maxInclinaison, maxInclinaison);
                moveY = nx.clip(moveY, -maxInclinaison, maxInclinaison);
                $("#tilt_infos").html("moveX : "+moveX+", moveY : "+moveY);

                roll = nx.prune(nx.scale(moveX, -maxInclinaison, maxInclinaison, min, max));
                pitch = nx.prune(nx.scale(moveY, -maxInclinaison, maxInclinaison, min, max));
            }
            else
            {
                roll = mid;
                pitch = mid;
            }


        });

        throttleyaw.on("*", (data) => {            
            if(data.press == 1){
                initialTYPos = {x: data.x, y: data.y};

                var x = nx.prune(move.val.x,2);
                var y = nx.prune(move.val.y,2);
                var z = nx.prune(move.val.z,2);

                moveInitial = {x: x,y: y,z: z};
            }
            
            if(data.press === 0){
                initialTYPos = null;
                currentThrottle = throttle;
                moveInitial = null;
                yaw = mid;
                //log({throttle: throttle,pitch: pitch});
            }

            if(initialTYPos !== null)
            {
                var tempX1 = data.x - initialTYPos.x;
                var tempY1 = initialTYPos.y - data.y;
                
                //log({tempX1: tempX1, tempY1: tempY1});
                
                if(tempX1 < seuil && tempX1 > -seuil)
                    tempX1 = 0;
                else{
                    tempX1 = tempX1 >= 0 ? (tempX1-seuil) : (tempX1+seuil);
                }

                if(tempY1 < seuil && tempY1 > -seuil)
                    tempY1 = 0;
                else{
                    tempY1 = tempY1 >= 0 ? (tempY1-seuil) : (tempY1+seuil);
                }

                tempX1 = nx.clip(tempX1,-maxPixVar,maxPixVar);
                tempY1 = nx.clip(tempY1,-maxPixVar,maxPixVar);
                throttletemp = nx.prune(nx.scale(tempY1, -maxPixVar, maxPixVar, -min,min));
                throttle = nx.clip(currentThrottle + throttletemp, min, max);
                yaw = nx.prune(nx.scale(tempX1, -maxPixVar, maxPixVar, min, max));
                //log({throttle: throttle,roll: roll});
            }
        });

        pitchroll.on("*", (data) => {            
            if(data.press == 1)
                initialPRPos = {x: data.x, y: data.y};
            
            if(data.press === 0){
                initialPRPos = null;
                pitch = mid;
                roll = mid;
            }

            if(initialPRPos !== null)
            {
                var tempX2 = data.x - initialPRPos.x;
                var tempY2 = initialPRPos.y - data.y;
                
                if(tempX2 < seuil && tempX2 > -seuil)
                    tempX2 = 0;
                else{
                    tempX2 = tempX2 >= 0 ? (tempX2-seuil) : (tempX2+seuil);
                }

                if(tempY2 < seuil && tempY2 > -seuil)
                    tempY2 = 0;
                else{
                    tempY2 = tempY2 >= 0 ? (tempY2-seuil) : (tempY2+seuil);
                }

                tempX2 = nx.clip(tempX2,-maxPixVar,maxPixVar);
                tempY2 = nx.clip(tempY2,-maxPixVar,maxPixVar);
                roll = nx.prune(nx.scale(tempX2, -maxPixVar, maxPixVar, min, max));
                pitch = nx.prune(nx.scale(tempY2, -maxPixVar, maxPixVar, min, max));
                log({roll: roll,yaw: yaw});
            }
        });

        arm.on("*", (data) => {
            if(data.value == 1)
                aux[0] = 1800;
            else
                aux[0] = 1100;
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
                aux[2] = 1100;
        });

        accel.on("*", (data) => {
            if(data.press == 1)
                 socket.emit('calibrage', true);
            if(data.press == 0)
                 socket.emit('calibrage', false); 
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
        $("#controller_status").html("roll = "+roll+", pitch = "+pitch+", yaw = "+yaw+", throttle = "+throttle+", aux1 = "+aux[0]+", aux2 = "+aux[1]+", aux3 = "+aux[2]+", aux4 = "+aux[3]);
         socket.emit('command', controller);
    },100);

});