/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
const atob = require('atob');

// include local config if it's present
try { require('../../config/local'); } catch (e) { console.log('no local config'); }

module.exports = {
  API_PATH: 'http://localhost:1337/api/',
  validLogin: {
    // These must be valid, real RIT SSO credentials
    // To setup, put them in your config/local.js file, according to the template
    // just so the credentials don't have to be stored in completely plain text, encode them
    userName: atob(process.env.TEST_UID || global.TEST_UID),
    password: atob(process.env.TEST_PWD || global.TEST_PWD),
  },
  endpoint: {
    LOGIN : 'login',
    LOGOUT: 'logout',
  },
};
