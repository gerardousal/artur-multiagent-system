'use strict';

var Promise = require('promise');
var Connection = require('../../node_modules/evejs/lib/transport/Connection');

/**
 * A local connection.
 * @param {AMQPTransport} transport
 * @param {string | number} id
 * @param {function} receive
 * @constructor
 */
function MQTTConection(transport, id, receive) {
  this.transport = transport;
  this.id = id;

  // ready state
  this.ready = this.transport._connect(id, receive);
}

/**
 * Send a message to an agent.
 * @param {string} to
 * @param {*} message
 * @return {Promise} returns a promise which resolves when the message has been sent
 */
MQTTConection.prototype.send = function (to, message) {
  var me = this;
  return new Promise(function (resolve, reject) {
    var msg = {
      body: {
        from: me.id,
        to: to,
        message: message
      }
    };
    // console.log('message', message);
    me.transport.connection.publish('iot', JSON.stringify(msg));
    resolve();
  });
};

/**
 * Close the connection
 */
MQTTConection.prototype.close = function () {
  this.transport._close(this.id);
};

module.exports = MQTTConection;
