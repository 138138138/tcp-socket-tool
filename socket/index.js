'use strict';

const { deviceInfoList, openTCPSocket } = require('./init');
const socketWrite = require('./actions/socketWrite');

// require lampServer/index.js, and able to use modules from init.js
module.exports.deviceInfoList = deviceInfoList;
module.exports.openTCPSocket = openTCPSocket;

module.exports.socketWrite = (deviceId, data) => socketWrite(deviceInfoList, deviceId, data);
