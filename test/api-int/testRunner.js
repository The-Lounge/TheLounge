require('any-promise/register/q');
const request = require('request-promise-any');

const timeout = 30000;
const interval = 1000;
let elpased = 0;
const pingEndpoint = 'http://localhost:1337/api/posting/-1';

const upInterval = setInterval(() => {
  console.log(`get ${pingEndpoint} after ${elpased}`);
  elpased += interval;
  request.get(pingEndpoint).then(() => {
    console.log('start test suite');
    clearInterval(upInterval);
    run();
  }).catch((e) => console.log('waiting: ' + (e || e.message)));

  if(elpased > timeout) {
    throw new Error('Timed out waiting for Sails to launch');
  }
}, interval);


