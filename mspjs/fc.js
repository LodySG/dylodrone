'use strict';

// define all the global variables that are uses to hold FC state
module.exports = class FC {
    constructor(){
        this.CONFIG = {
            apiVersion:    "0.0.0",
            flightControllerIdentifier: '',
            flightControllerVersion: '',
            version:       0,
            buildInfo:     '',
            multiType:     0,
            msp_version:   0, // not specified using semantic versioning
            capability:    0,
            pidDeltaUs:    0,
            gyroDeltaUs:   0,
            cpuload:       0,
            i2cError:      0,
            activeSensors: 0,
            mode:          0,
            profile:       0,
            uid:           [0, 0, 0],
            accelerometerTrims: [0, 0]
        };
        
        this.FEATURE = {
            enabled: 0,
        };

        this.MIXER = {
            mode:     0
        };
        
        this.BOARD_ALIGNMENT = {
            board_align_roll:       0,
            board_align_pitch:      0,
            board_align_yaw:        0
        };
        
        this.LED_STRIP = [];
        this.LED_COLORS = [];
        this.LED_MODE_COLORS = [];
        
        this.PID = {
            controller:             0
        };
        
        this.PID_names = [];
        this.PIDs = new Array(10);
        for (var i = 0; i < 10; i++) {
            PIDs[i] = new Array(3);
        }
        
        this.RC_MAP = [];
        
        // defaults
        // roll, pitch, yaw, throttle, aux 1, ... aux n
        this.RC = {
            active_channels: 0,
            channels: new Array(32)
        };
        
        this.RC_tuning = {
            RC_RATE:         0,
            RC_EXPO:         0,
            roll_pitch_rate: 0, // pre 1.7 api only
            roll_rate:       0, 
            pitch_rate:      0,
            yaw_rate:        0,
            dynamic_THR_PID: 0,
            throttle_MID:    0,
            throttle_EXPO:   0,
            dynamic_THR_breakpoint: 0,
        	RC_YAW_EXPO:         0
        };
        
        this.AUX_CONFIG = [];
        this.AUX_CONFIG_IDS = [];
        
        this.MODE_RANGES = [];
        this.ADJUSTMENT_RANGES = [];
        
        this.SERVO_CONFIG = [];
        this.SERVO_RULES = [];
        
        this.SERIAL_CONFIG = {
            ports: [],
            
            // pre 1.6 settings
            mspBaudRate: 0,
            gpsBaudRate: 0,
            gpsPassthroughBaudRate: 0,
            cliBaudRate: 0,
        };
        
        this.SENSOR_DATA = {
            gyroscope:     [0, 0, 0],
            accelerometer: [0, 0, 0],
            magnetometer:  [0, 0, 0],
            altitude:      0,
            sonar:         0,
            kinematics:    [0.0, 0.0, 0.0],
            debug:         [0, 0, 0, 0]
        };
        
        this.MOTOR_DATA = new Array(8);
        this.SERVO_DATA = new Array(8);
        
        this.GPS_DATA = {
            fix:             0,
            numSat:          0,
            lat:             0,
            lon:             0,
            alt:             0,
            speed:           0,
            ground_course:   0,
            distanceToHome:  0,
            ditectionToHome: 0,
            update:          0,
        
            // baseflight specific gps stuff
            chn:     [],
            svid:    [],
            quality: [],
            cno:     []
        };
        
        this.ANALOG = {
            voltage:    0,
            mAhdrawn:   0,
            rssi:       0,
            amperage:   0
        };
        
        this.VOLTAGE_METERS = [];
        this.VOLTAGE_METER_CONFIGS = [];
        this.AMPERAGE_METERS = [];
        this.AMPERAGE_METER_CONFIGS = [];
        
        this.BATTERY_STATE = {};
        this.BATTERY_CONFIG = {};
        
        this.ARMING_CONFIG = {
            auto_disarm_delay:      0,
            disarm_kill_switch:     0
        };
        
        this.FC_CONFIG = {
            loopTime: 0
        };
        
        this.MISC = {
            midrc:                  0,
            minthrottle:            0,
            maxthrottle:            0,
            mincommand:             0,
            failsafe_throttle:      0,
            gps_type:               0,
            gps_baudrate:           0,
            gps_ubx_sbas:           0,
            multiwiicurrentoutput:  0,
            rssi_channel:           0,
            placeholder2:           0,
            mag_declination:        0, // not checked
            vbatscale:              0,
            vbatmincellvoltage:     0,
            vbatmaxcellvoltage:     0,
            vbatwarningcellvoltage: 0
        };
        
        this._3D = {
            deadband3d_low:         0,
            deadband3d_high:        0,
            neutral3d:              0,
            deadband3d_throttle:    0
        };
        
        this.DATAFLASH = {
            ready: false,
            supported: false,
            sectors: 0,
            totalSize: 0,
            usedSize: 0
        };
        
        this.SDCARD = {
            supported: false,
            state: 0,
            filesystemLastError: 0,
            freeSizeKB: 0,
            totalSizeKB: 0,
        };
        
        this.BLACKBOX = {
            supported: false,
            blackboxDevice: 0,
            blackboxRateNum: 1,
            blackboxRateDenom: 1
        };
        
        this.TRANSPONDER = {
            supported: false,
            data: []
        };
        
        this.RC_deadband = {
            deadband:               0,
            yaw_deadband:           0,
            alt_hold_deadband:      0
        };
        
        this.SENSOR_ALIGNMENT = {
            align_gyro:             0,
            align_acc:              0,
            align_mag:              0
        };
        
        this.RX_CONFIG = {
            serialrx_provider:      0,
            stick_max:              0,
            stick_center:           0,
            stick_min:              0,
            spektrum_sat_bind:      0,
            rx_min_usec:            0,
            rx_max_usec:            0
        };
        
        this.FAILSAFE_CONFIG = {
            failsafe_delay:                 0,
            failsafe_off_delay:             0,
            failsafe_throttle:              0,
            failsafe_kill_switch:           0,
            failsafe_throttle_low_delay:    0,
            failsafe_procedure:             0
        };
        
        this.RXFAIL_CONFIG = [];
        
        this.PILOT_CONFIG = {
            callsign: " CLEANFLIGHT! ",
        };
        
        this.VTX = {
            supported: false,
        };
        
        this.VTX_STATE = {
            channel: 0,
            band: 0,
            rfPower: 0,
            enabled: false,
        };
        
        this.VTX_CONFIG = {
            channel: 0,
            band: 0,
            rfPower: 0,
            enabledOnBoot: false,
        };
    }
};