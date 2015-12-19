var SensorAgent = require('./agents/sensor_agent');
var ActionAgent = require('./agents/action_agent');
var hypertimer = require('hypertimer');
var MQTTTransport = require('./transport/mqtt/MQTTTransport');
var BrainHome = require('./brain_home')


var timer = hypertimer();

var transport = new MQTTTransport({id: "iot", url: "mqtt://127.0.0.1" });

var brain = new BrainHome("control");
brain.connect(transport);
var sensor1 = new SensorAgent('sense_left', "w", "control",5000);
sensor1.connect(transport);
brain.registerSensor(sensor1);
var sensor2 = new SensorAgent('sense_rigth', "m", "control",3000);
sensor2.connect(transport);
brain.registerSensor(sensor2);
//var sensor3 = new SensorAgent('sense_mid', "g", "control",1000);
//sensor3.connect(transport);
//brain.registerSensor(sensor3);

var heaterLeft = new ActionAgent('heater_left');
var heaterRigth = new ActionAgent('heater_rigth');
heaterLeft.connect(transport);
heaterRigth.connect(transport);

brain.sense(timer);
