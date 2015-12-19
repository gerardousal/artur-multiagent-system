var eve = require('evejs');
var math = require('mathjs')


function SensorAgent(id, agentType, controlId, interval)
{
    this.controlId = controlId;
    this.interval = interval;
    this.agentType = agentType;
    this.idAgent =id;
    eve.Agent.call(this, id);
    this.connect(eve.system.transports.getAll());
    this.value = 0.00;
}

// extend the eve.Agent prototype
SensorAgent.prototype = Object.create(eve.Agent.prototype);
SensorAgent.prototype.constructor = SensorAgent;

/**
 * Send a greeting to an agent
 * @param {String} to
 */
SensorAgent.prototype.updateAction = function(to, message) {
  this.send("mqtt://127.0.0.1/"+to, message).done();
};

SensorAgent.prototype.sense = function(timer)
{
  // set an interval
  var self = this;
  timer.setInterval(function () {
      var value = self.getValues();
      // console.log('interval'
      // , timer.getTime().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      // , "sensor:"
      // , self.idAgent
      // , "value:"
      // , value); // interval, 12:00:30, 12:00:35, 12:00:40, etc ...
      self.updateAction(self.controlId,value);
  }, self.interval);

}

SensorAgent.prototype.getValues = function()
{

  total =   this.value + 10 + Math.random()/100;
  this.value++;
  valueReturn = Math.abs(math.eval("sin("+total+ " deg) * 100  + 50 ")).toFixed(0);
  // else if (valueReturn <= 120) {
  //   this.value--;
  // }
  return valueReturn;
}

module.exports = SensorAgent;
