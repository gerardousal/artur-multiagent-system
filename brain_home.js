var eve = require('evejs');
var SensorAgent = require('./agents/sensor_agent');
var hypertimer = require('hypertimer');
var MQTTTransport = require('./transport/mqtt/MQTTTransport');


function BrainHome(id) {
  eve.Agent.call(this, id);
  this.connect(eve.system.transports.getAll());
  this.actioners = [];
  this.sensors = [];
}

// extend the eve.Agent prototype
BrainHome.prototype = Object.create(eve.Agent.prototype);
BrainHome.prototype.constructor = BrainHome;

BrainHome.prototype.sense = function(timer)
{
  for (i=0;i<this.sensors.length;i++)
  {this.sensors[i].sense(timer);}
}

BrainHome.prototype.registerSensor = function(sensor) {
    this.sensors.push(sensor);
}

BrainHome.prototype.registerAction = function(actioner) {
    this.actioners.push(actioner);
}

BrainHome.prototype.receive = function(from, message) {
  if (message.to === this.id) {
    var value = parseFloat(message.message)
    console.log(this.id + ":"+ message.from + ' said: ' + value);
    //change values

    if (message.from == 'sense_left')
    {
        if (value >= 100)
        {
          this.send("mqtt://127.0.0.1/"+"heater_left", {status:"off"}).done();
        }
        else if (value >= 85) {
          this.send("mqtt://127.0.0.1/"+"heater_left", {status:"on"}).done();
        }
        else {
          this.send("mqtt://127.0.0.1/"+"heater_left", {status:"off"}).done();
        }
    }
    if (message.from == 'sense_rigth')
    {
      if (value >= 85)
      {
        this.send("mqtt://127.0.0.1/"+"heater_rigth", {status:"off"}).done();
      }
      else if (value >= 75) {
        this.send("mqtt://127.0.0.1/"+"heater_rigth", {status:"on"}).done();
      }
      else {
        this.send("mqtt://127.0.0.1/"+"heater_rigth", {status:"off"}).done();
      }
    }
  }
};

module.exports = BrainHome;

//sensors data
//{w|kit1|34}
//{t|kit1|45}
/*
  w - wa -- water pipeline
  m - mv -- movement sensor
  g - gs -- gas pipeline
  t - tm - temperature
*/
/*
  ro1...n -- room number
  kit1..n -- kitchen number
  bat1..n -- bathroom number
*/
/*
  data -- 0 .. 1023
*/
//actioners data
