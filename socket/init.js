'use strict';

/**
 * @typedef DeviceInfo
 * @type {object}
 * @property {string} deviceId
 * @property {net.Socket} socket - socket object */

const net = require('net');
const config = require('../config');
const { logger } = require('../utils/log4js');

/************************************************************************************* */

/** Let other functions read the connected devices
 * @type {DeviceInfo[]} */
let deviceInfoList = [];

/************************************************************************************* */

module.exports.deviceInfoList = deviceInfoList;

/** tcp
 * @param {number} port */
module.exports.openTCPSocket = port => {
  logger.info('Start TCP Socket Server port:', port);

  const tcpServer = net.createServer(socket => {
    if (config.tcpHex) {
      socket.setEncoding('hex');
    } else {
      socket.setEncoding('utf8');
    }

    logger.info('TCP socket connect', socket.remoteAddress, socket.remotePort);

    // enable logging
    socket.on('data', buffer => {
      const msg = 'Receive ' + socket.remoteAddress + ' ' + socket.remotePort + ' ' + buffer;

      logger.info(msg);
    });

    /** When messages received, get device information from the messages
     * @type {DeviceInfo} */
    var deviceInfo;

    const analyzeMsg = async buffer => {
      /** Try to parse data packets */
      // deviceId received
      deviceInfo = {
        deviceId: socket.remoteAddress + ' ' + socket.remotePort, // Modify this part to suit your device identifider format
        socket,
      };
      deviceInfoList.push(deviceInfo);
    };

    socket.on('data', analyzeMsg); // Start analyzeMsg on data receival

    // Device disconnect
    socket.on('close', () => {
      logger.info('TCP close socket', socket.remoteAddress, socket.remotePort);
      if (deviceInfo != null) {
        logger.info('Device disconnected ' + deviceInfo.deviceId);
        // Delete record
        deviceInfoList.splice(deviceInfoList.indexOf(deviceInfo), 1);
      }
    });

    socket.on('error', err => {
      logger.error('TCP error in socket', socket.remoteAddress, socket.remotePort, err);
    });
  });

  tcpServer.on('listening', () => {
    logger.info('start listening...');
  });

  tcpServer.on('error', () => {
    logger.error('listen error');
  });

  tcpServer.on('close', () => {
    logger.info('server stop listener');
  });

  tcpServer.listen({
    port: port,
  });
};
