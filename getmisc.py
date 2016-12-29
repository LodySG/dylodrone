from pyMultiwii import MultiWii
from sys import stdout

serialport = "/dev/ttyUSB0"
baud = 115200
board = MultiWii(serialport)

try:
    while True:
        board.sendCMD(0,MultiWii.ACC_CALIBRATION,None)
except Exception,error:
    print "Error on Main: "+str(error)