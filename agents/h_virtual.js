var eve = require('evejs');

this.temperature = 5; //5 degrees
this.roomid = "";

function HumanVirtual(id) {
  // execute super constructor
  this.roomid = id;
  eve.Agent.call(this, id);
  // connect to all transports configured by the system
  this.connect(eve.system.transports.getAll());
}
