'use strict';

const express = require('express');
const router = express.Router();
const socket = require('../socket');

router.post('/write', async function (req, res, next) {
  try {
    const returnData = await socket.socketWrite(req.body.deviceId, req.body.data);
    // If returnData is not normal
    if (returnData.stack && returnData.message) {
      throw returnData;
    }

    return res.json({ code: 0, data: returnData });
  } catch (err) {
    return res.json({ code: 1, msg: err.message });
  }
});

router.get('/listAll', async function (req, res, next) {
  try {
    const returnData = socket.deviceInfoList.map(m => ({
      deviceId: m.deviceId,
    }));

    return res.json({ code: 0, data: returnData });
  } catch (err) {
    return res.json({ code: 1, msg: err.message });
  }
});

module.exports = router;
