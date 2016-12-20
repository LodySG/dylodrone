var TcpServer = require('multiwii-msp').TcpServer;

module.exports = class Droneserver {
    constructor(){
        this.server = new TcpServer(3002, true);
        this.drone = null;
        this.server.on('register', (key,device) => {
            device.on('open', () => {
                this.drone = device;
            });
            device.on('update', (data) => {
                console.log(data);
            });
        });

        setTimeout(function () {
            this.server.getDevice();
        });
    }
}