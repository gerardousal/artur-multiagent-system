var eve = require('evejs');

function ActionAgent(id)
{
    eve.Agent.call(this, id);
    this.connect(eve.system.transports.getAll());
    this.isOn = false;
}

// extend the eve.Agent prototype
ActionAgent.prototype = Object.create(eve.Agent.prototype);
ActionAgent.prototype.constructor = ActionAgent;


ActionAgent.prototype.receive = function(from, message) {
  if (message.to === this.id) {
      if (message.message.status === 'on' && !this.isOn) {
          console.log(this.id + ":on");
          this.isOn = true;
      }
      else if (message.message.status === 'off' && this.isOn) {
        console.log(this.id + ":off");
        this.isOn = false;
      }
  }
  //change values
};

module.exports = ActionAgent;
