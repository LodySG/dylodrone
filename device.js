var msp = require('node-msp');
var serialport = require('serialport');

module.exports = class Device{
    constructor(serial, baud){
        this.msp = msp;
        this.reader = new msp.reader();
        this.port = new serialport(serial, {baudrate: baud});
        this.lastMessage = "";
        this.lastError = "";

        this.reader.on('error', (error) => {
            console.log('There was an error - ', error);
        });
        
        this.reader.on('message', (message) => {
            console.log(message);
            this.lastMessage = message;
        });

        this.port.on('open',() => {
            console.log('port connected');
            
            this.port.on('data',(data) => {
                    this.reader.handleBuffer(data);
                });
            });
            
            this.port.on('close',() => {
                console.log('port closed');
            });

            var controller = {
                throttle : 1000,
                aux : [1000, 1900]
            };

        /*setInterval(function () {
            var message = msp.send('MSP_MOTOR');
            port.write(message, function (error) {
            //console.log(error);
            });
        }, 200);*/

        setInterval(() => {
            var message = msp.send('MSP_RC', controller);
            this.port.write(message, function (error) {
                //console.log(controller.throttle);
                //console.log('Sent');
            });
        }, 100);

        setTimeout(() => {
            console.log('startup');
            controller.aux[1] = 1900;
            controller.throttle = 1300;
        }, 1000);

        setTimeout(() => {
            console.log('shutdown');
            controller.aux[1] = 1000;
            controller.throttle = 1000;
        }, 3000);

        var parsing = 'header';
        var position = 0;
        var messageLength;
        var xor = undefined;

        var message = {
            id : undefined,
            parts : []
        };
    }

    setRc(dataRc){
        var message = msp.send('MSP_SET_RAW_RC', dataRc);
        console.log(message);
        this.port.write(message, function (error) {
            console.log(dataRc.throttle);
            console.log('Sent');
        });
    };
};