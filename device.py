import redis
import json
from pyMultiwii import MultiWii
from time import sleep
from sys import stdout

serialport = "/dev/ttyUSB0"
baud = 115200
r = redis.StrictRedis(host='localhost', port=6379, db=0)
board = MultiWii(serialport)

try:
    while True:
        controller = r.hgetall("drone:controller")
        #[roll,pitch,yaw,throttle,aux1,aux2,aux3,aux4]
        
        donnee = [int(controller['roll'],base=10), int(controller['pitch'],base=10), int(controller['yaw'],base=10), int(controller['throttle'],base=10), int(controller['aux1'],base=10), int(controller['aux2'],base=10), int(controller['aux3'],base=10), int(controller['aux4'],base=10)]
        if(int(controller['acc'],base=10) == 1):
            board.sendCMD(0, MultiWii.ACC_CALIBRATION, None)
        board.sendCMD(16, MultiWii.SET_RAW_RC,donnee)

        #get current RC setup
        board.getData(MultiWii.RC)
        stdout.write("\r%s" % board.rcChannels )
        stdout.flush()
        #MSP_ACC_CALIBRATION : request acc calibration
        #board.sendCMD(0,MultiWii.ACC_CALIBRATION,None)
        #MSP_MISC : get status
        #board.getData(MultiWii.MISC)

except Exception,error:
    print "Error on Main: "+str(error)