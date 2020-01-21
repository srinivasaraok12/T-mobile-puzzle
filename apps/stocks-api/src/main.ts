/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { environment } from './environments/environment';
const request = require('request');
const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/api/beta/stock/{symbol}/chart/{timeperiod}',
    handler: async (req, reply) => {
      const { symbol, timeperiod } = req.params;
      const token = environment.apiKey;
      const response = server.methods.getStockData(symbol, timeperiod, token);
      return response;
    }
  });

  const getStockData = function(symbol, timePeriod, token) {
    const url = `${environment.apiURL}/beta/stock/${symbol}/chart/${timePeriod}?token=${token}`;
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (response && response['statusCode'] === 200) {
          resolve(body);
        }
      });
    });
  };

  server.method('getStockData', getStockData, {
    cache: {
      expiresIn: 700000,
      generateTimeout: 2000000
    },
    generateKey: (symbol, timePeriod) => symbol + '_' + timePeriod
  });
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
