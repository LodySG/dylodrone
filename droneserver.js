var TcpServer = require('multiwii-msp').TcpServer;

module.exports = class Droneserver {
    constructor(port){
        //this.server = new TcpServer(port, true);
        this.server = new TcpServer(port);
        this.drone = null;
        this.rc = null;
        
        this.server.on('register', (key,device) => {
            device.on('open', () => {
                this.drone = device;
                console.log(this.drone);
            });
            device.on('update', (data) => {
                //console.log(data);
                this.rc = data;
            });
        });

        setTimeout(() => {
            this.server.getDevice();
        });
    }

    getAttitude(){
        return this.rc.attitude;
    }

    /*
        {   
            roll: 1500,
            pitch: 1500,
            yaw: 1500,
            throttle: 1500,
            aux1: 1500,
            aux2: 1500,
            aux3: 1500,
            aux4: 1500 
        }

        Device.prototype.accCalibration
        Device.prototype.setHead
        Device.prototype.setRawRc 
    */

    setRc(dataRc){
        this.drone.setRawRc(dataRc,null, null);
    }

    getDevice(){
        return this.drone.ident({}, function (error, ident) {
            console.log(ident);
        });
    }
}