var mqtt = require('mqtt')
var broker = 'mqtt://localhost'
var client = mqtt.connect(broker)

client.on('connect', function () {
  client.subscribe('iot');
  //client.publish('iot', JSON.stringify({message:"hello world"}));
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('topic', topic,'message', JSON.stringify(message));
//  client.end();
});
