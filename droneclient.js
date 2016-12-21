var TcpClient = require('multiwii-msp').TcpClient;

//var client = new TcpClient('localhost', 3002, '/dev/ttyUSB0', 115200, true);
//var client = new TcpClient('localhost', 3002, '/dev/ttyUSB0', 115200);
module.exports = class Droneclient{
    constructor(url, port, serial, baud){
        this.client = new TcpClient(url, port, serial, baud);
    }
};