'use strict';

const http = require('http');
const express = require('express');
const { logger } = require('./utils/log4js');
const apis = require('./api');
const { openTCPSocket } = require('./socket');
// const { connectDB } = require('./db/connetDB');

/************************************************************************************* */

const webPort = process.env.WEBPORT || 60200;
const tcpPort = process.env.TCPPORT || 60201;
// connectDB();

if (tcpPort) {
  openTCPSocket(tcpPort); //Start TCP server
}

// ------Express server------
if (webPort) {
  const app = express();

  // set headers
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,GET,DELETE,OPTIONS');

    next();
  });

  // Validate API key from database
  app.use(async function (req, res, next) {
    try {
      // const key = req.get('x-api-key');
      // const host = req.socket.remoteAddress;
      // // Query database for apikey
      // const authorize = await Apikey.findOne({ key: key, host: host, deleteAt: { $exists: false } });
      // if (!authorize) {
      //   res.header('Content-Type', 'text/html; charset=utf-8');
      //   res.status(401).send('Unauthorized');
      //   return;
      // }

      res.header('Content-Type', 'application/json;charset=utf-8');
      next();
    } catch (err) {
      next(err);
    }
  });

  // load Express JSON config
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // enable routes from /api
  app.use('/api', apis);

  // error handler
  app.use(function (err, req, res, next) {
    logger.error(err);
    res.status(err.status || 500);
    res.send('error');
  });

  // ------create server------
  app.set('port', webPort);
  const server = http.createServer(app);

  // Server config
  server.listen(webPort);

  server.on('error', error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', () => {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    logger.info('HTTP Server Listening on ' + bind);
  });
}
