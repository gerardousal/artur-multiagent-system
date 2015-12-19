'use strict';

var Promise = require('promise');
var Transport = require('../../node_modules/evejs/lib/transport/Transport');
var MQTTConection = require('./MQTTConnection');

/**
 * Use AMQP as transport
 * @param {Object} config   Config can contain the following properties:
 *                          - `id: string`
 *                          - `url: string`
 *                          - `host: string`
 *                          The config must contain either `url` or `host`.
 *                          For example: {url: 'amqp://localhost'} or
 *                          {host: 'dev.rabbitmq.com'}
 * @constructor
 */
function MQTTTransport(config) {
  this.id = config.id || null;
  this.networkId = parseURL(config.url).domain || config.host || null;
  this['default'] = config['default'] || false;

  this.config = config;
  this.connection = null;
  this.exchange = null;

  this.subscriptions = [];
}

function parseURL(url) {
  // match an url like "protocol://domain/path"
  var match = /^([A-z]+):\/\/([^\/]+)(\/(.*)$|$)/.exec(url);
  if (match) {
    return {
      protocol: match[1],
      domain: match[2],
      path: match[4]
    }
  }

  return null;
};

MQTTTransport.prototype = new Transport();
MQTTTransport.prototype.type = 'mqtt';

/**
 * Connect an agent
 * @param {String} id
 * @param {Function} receive     Invoked as receive(from, message)
 * @return {AMQPConnection} Returns a connection.
 */
MQTTTransport.prototype.connect = function(id, receive) {
  return new MQTTConection(this, id, receive);
};

/**
 * Get an AMQP connection. If there is not yet a connection, a connection will
 * be made.
 * @param {Function} callback   Invoked as callback(connection)
 * @private
 */
MQTTTransport.prototype._getConnection = function(callback) {
  var me = this;

  if (this.connection) {
  //  console.log('connection avaiable');
    // connection is available
    callback(this.connection);
  }
  else {
    if (this._onConnected) {
    //  console.log('connection is not ready');
      // connection is being opened but not yet ready
      this._onConnected.push(callback);
    }
    else {
    //  console.log('new connection');
      // no connection, create one
      this._onConnected = [callback];

      var mqtt = require('mqtt');   // lazy load the mqtt library
      var connection = mqtt.connect(me.config.url)
    //  console.log('new connection to mqtt', me.config.url);
      connection.on('connect', function () {
    //    console.log('connected to mqtt broker');
        connection.subscribe('iot');
        me._onConnected.forEach(function (callback) {
          callback(me.connection);
        });
      });
      me.connection = connection;
    }
  }
};

/**
 * Open a connection
 * @param {string} id
 * @param {Function} receive     Invoked as receive(from, message)
 */
MQTTTransport.prototype._connect = function(id, receive) {
  var me = this;
  return new Promise(function (resolve, reject) {
    function subscribe(connection) {
      me.subscriptions.push({
        id: id,
        consumerTag: connection.consumerTag
      });
      connection.on('message', function (topic, message) {
        // message is Buffer
        var objeto = JSON.parse(message);
        //console.log('recieve message', message);
        receive(topic, objeto.body);
        //connection.end();
      });
      resolve(me);
      //console.log('subscription added');
    }
    me._getConnection(subscribe);
  });
};

/**
 * Close a connection an agent by its id
 * @param {String} id
 */
MQTTTransport.prototype._close = function(id) {
  var i = 0;
  while (i < this.subscriptions.length) {
    var subscription = this.subscriptions[i];
    if (subscription.id == id) {
      // remove this entry
      this.subscriptions.splice(i, 1);
    }
    else {
      i++;
    }
  }

  if (this.subscriptions.length == 0) {
    // fully disconnect if there are no subscribers left
    this.exchange.close();
    //this.connection.disconnect();

    this.connection = null;
    this.exchange = null;
  }
};

/**
 * Close the transport.
 */
MQTTTransport.prototype.close = function() {
  this.connection.destroy();
  this.connection = null;
};

module.exports = MQTTTransport;

/*----------------------------------------------------------------------------------------*/

// var transport = new MQTTTransport({id: "hola", url: "mqtt://127.0.0.1" });
// // var receive = function (from, message) {
// //   return me._receive(from, message);
// //   console.log(message);
// // };
//
// // var connection = transport.connect("hoola", receive);
// // connection.send('mqtt://127.0.0.1', {message:"hola mundo"});
// var Agent = require('../../Agent');
// // var transport = new MQTTTransport({id: "hola", url: "127.0.0.1:1883" });
// var agent1 = new Agent('agent1');
// var agent2 = new Agent('agent2');
// agent1.connect(transport);
// agent2.connect(transport);
// agent2.receive = function (from, message) {
//     if (this.id == message.to) {
//       console.log('msg', message);
//     }
// }
// agent1.send("mqtt://127.0.0.1/agent3", {message:"hello!"}).done();
