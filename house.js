var hypertimer = require('hypertimer');
var eve = require('evejs');

eve.system.init({
  transports: [
    {
      type: 'ws',
      localShortcut: true
    }
   ]
});

var ActionAgent = require('./agents/action_agent');
var SensorAgent = require('./agents/sensor_agent');
var HelloAgent = require('./agents/basic_agent');

var actioners = [];
var sensors = [];

var agent1 = new HelloAgent('agent1');


actioners.push(new ActionAgent('bathroom'));
actioners.push(new ActionAgent('kitchen'));
actioners.push(new ActionAgent('restroom'));
actioners.push(new ActionAgent('main_bedroom'));
actioners.push(new ActionAgent('child_betroom'));

sensors.push(new SensorAgent('bathroom'));
sensors.push(new SensorAgent('kitchen'));
sensors.push(new SensorAgent('restroom'));
sensors.push(new SensorAgent('main_bedroom'));
sensors.push(new SensorAgent('child_betroom'));

var timer = hypertimer();


// set an interval
var interval = 1000; // milliseconds (hyper-time)
var counter = 0;

timer.setInterval(function () {
  console.log('interval', timer.getTime()); // interval, 12:00:30, 12:00:35, 12:00:40, etc ...
    for (i=0;i<sensors.length;i++)
    {sensors[i].sense();}
}, interval);
