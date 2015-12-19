var eve = require('evejs');

var HelloAgent = require('./agents/basic_agent');

eve.system.init({
  transports: [
    {
      type: 'ws',
      localShortcut: true
    }
   ]
});

// create two agents
var agent1 = new HelloAgent('agent1');
var agent2 = new HelloAgent('agent2');

agent2.sayHello('agent1');
