const log4js = require('log4js');
const config = require('../config/');
const path = require('path');
log4js.configure({
  replaceConsole: true,
  pm2: true,
  appenders: {
    stdout: {
      type: 'console',
    },
    req: {
      type: 'dateFile',
      filename: path.join(config.loggerBasePath, 'logs/reqlog/req'),
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
    err: {
      type: 'dateFile',
      filename: path.join(config.loggerBasePath, 'logs/errlog/err'),
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
    oth: {
      type: 'dateFile',
      filename: path.join(config.loggerBasePath, 'logs/othlog/oth'),
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: { appenders: ['stdout', 'req'], level: 'debug' }, //debug info
    err: { appenders: ['stdout', 'err'], level: 'error' },
  },
});

exports.getLogger = function (name) {
  return log4js.getLogger(name || 'info');
};

exports.useLogger = function (app, logger) {
  app.use(
    log4js.connectLogger(logger || log4js.getLogger('info'), {
      format:
        '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]',
    })
  );
};

// default global logger
exports.logger = exports.getLogger();
