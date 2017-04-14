'use strict';

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var events = new EventEmitter2({
    wildcard: true
});

const tagIdentifier    = 0xaa80;
const tempAServiceAddr  = 'f000aa00-0451-4000-b000-000000000000';
const tempAValueAddr    = 'f000aa01-0451-4000-b000-000000000000';
const tempBServiceAddr  = 'f000bb00-0451-4000-b000-000000000000';
const tempBValueAddr    = 'f000bb01-0451-4000-b000-000000000000';

var   service;

var chartDataA = [];
var chartDataB = [];

var valueA = 0;
var valueB = 0;

var liveSensors = {};
var isConnected = false;

var startTime = Date.now();

const computeTemp = function(byteArray) {
  // javascript integers are 32bits so this should work
  // There is a DataView object that would might be better to try here it allows
  // the user to control the endianess of the value can can read from any buffer
  var temp100 =
    byteArray.getUint8(3) << 24 |
    byteArray.getUint8(2) << 16 |
    byteArray.getUint8(1) << 8  |
    byteArray.getUint8(0);

  // the temperature data is returned in celcius times 100 so we need to divide
  return temp100/ 100.0;
};

const readTemp = function (byteArrayA, byteArrayB) {

  logMessage(byteArrayA);

  var debugArrayData = [];
  for (var i = 0; i < byteArrayA.length; i++) {
    debugArrayData.push(byteArrayA[i]);
  }
  logMessage(debugArrayData.join(''));

  valueA = { liveValue: computeTemp(byteArrayA) };
  valueB = { liveValue: computeTemp(byteArrayB) };
  liveSensors = [valueA, valueB];

};

const logMessage = function (message, error) {
  if (error) {
    console.error(message, error);
    events.emit('screenConsole', message);
    events.emit('screenConsole', error);
  } else {
    console.log(message);
    events.emit('screenConsole', message);
  }
}


module.exports = {
  connect: function (address) {
    let request = navigator.bluetooth.requestDevice({
      filters: [{ name: "Thermoscope" }],
      optionalServices: [tempAServiceAddr, tempBServiceAddr]
    })

    let characteristicA, characteristicB;

    // Step 2: Connect to it
    request.then(function (device) {
      events.emit('connected');
      return device.gatt.connect();
    })
      .catch(function (error) {
        events.emit('connectionLost');
        logMessage('Connection failed!', error);
        isConnected = false;
      })
      // Step 3: Get the Service
      .then(function (server) {
        isConnected = true;
        window.server = server;
        return server.getPrimaryService(tempAServiceAddr);
      })
      .catch(function (error) {
        events.emit('connectionLost');
        logMessage('Failed to get Primary Service at address A', error);
        isConnected = false;
      })
      .then(function (service) {
        return service.getCharacteristic(0x0001);
      })
      .then(function (_characteristicA) {
        characteristicA = _characteristicA;
        // get second service
        return server.getPrimaryService(tempBServiceAddr);
      })
      .catch(function (error) {
        events.emit('connectionLost');
        logMessage('Failed to get Primary Service at address B', error);
        isConnected = false;
      })
      .then(function (service) {
        return service.getCharacteristic(0x0001);
      })
      .then(function (characteristicB) {
        startTime = Date.now();
        const takeReading = function () {
          let arrayA;
          characteristicA.readValue()
            .then(function (_arrayA) {
              arrayA = _arrayA;
              return characteristicB.readValue();
            })
            .then(function (arrayB) {
              readTemp(arrayA, arrayB);
              events.emit('statusReceived');
            });
        };
        if (isConnected) {
          window.takeReadingIntervalID = setInterval(takeReading, 6000);
        } else {
          window.takeReadingIntervalID = null;
        }
      })
      .catch(function (error) {
        events.emit('connectionLost');
        logMessage('Connection failed!', error);
        isConnected = false;
      });
  },
  on: function() {
      events.on.apply(events, arguments);
  },

  off: function() {
      events.off.apply(events, arguments);
  },

  get liveSensors() {
    return liveSensors;
  },

  get isConnected() {
    return isConnected;
  }
};

