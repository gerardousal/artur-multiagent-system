var net = require('net');
var eve = require('evejs');
var HelloAgent = require('./agents/basic_agent');

var sensors = [];

var agent1 = new HelloAgent('agent1');
var agent2 = new HelloAgent('agent2');

agent2.send('agent1', 'Hello agent1!');


net.createServer(function (socket) {
  socket.name = socket.remoteAddress + ":" + socket.remotePort

  socket.on('data', function (data) {
  });
});

/*
// send a wrong message to the calc agent
jack.request('calc', 'wrong input...')
    .then(function (response) {
      console.log('response:', response);
    })
    .catch(function (err) {
      console.log('We should receive an error because of wrong input: ');
      console.log('  ', err.toString());
    });
    */
