'use strict';

const { logger } = require('../../utils/log4js');
const config = require('../../config');

/** 
 * @param {[import('../init').DeviceInfo]} deviceInfoList - Pass init's deviceInfoList here
 * @param {string} deviceId
 * @param {string} data - buffer or bufferString to write */
module.exports = (deviceInfoList, deviceId, data) => {
  try {
    // Find devices
    const device = deviceInfoList.find(f => f.deviceId === deviceId);
    if (device === undefined) {
      throw new Error('Device not found.');
    }

    if (config.tcpHex) {
      const dataBuffer = Buffer.from(data, 'hex');
      device.socket.write(dataBuffer);
    } else {
      device.socket.write(data);
    }
    logger.info('Send ' + device.deviceId + ' ' + data);

    return 'success';
  } catch (err) {
    return err; // handle error in other functions
  }
};
