'use strict';
/**
 * local.js template
 * This file contains instructions for configuring your local data
 *
 * To setup your local configuration:
 *
 * 1. Copy this file, and rename it to "local.js". By default,
 *    config/local.js is ignored in git. Ensure your local.js file is NEVER
 *    committed to git once the config values are populated.
 *
 * 2. In the copied file, populate the values as indicate below
 *
 ****************************************************************************/

/*****************************************************************************
 *                                                                           *
 * Local integration/system test credentials                                 *
 *                                                                           *
 * Testing the authentication functionality requires real, valid RIT         *
 * credentials, so they need to configured locally. If you need to run the   *
 * tests, fill in these values.                                              *
 *                                                                           *
 * So credentials to run the tests don't have to be shown in plain text,     *
 * the tests are configured to decode them from base 64 encoding. To get     *
 * these values, in your browser console, run `atob` on your username and    *
 * password. (ex. atob('gjr8050') > [some binary string]).                   *
 ****************************************************************************/
global.TEST_UID = ''; // just the username, ex. efs2220
global.TEST_PWD = '';

module.exports = {
  connections: {
    /*************************************************************************
     *                                                                       *
     * Mongo Connection Configuration                                        *
     *                                                                       *
     * This block contains the credentials to connect to the Mongo server.   *
     * You need a connection to Mongo to run the Sails app. Get these values *
     * from Greg.                                                            *
     *                                                                       *
     ************************************************************************/
    herokuMongo: {
      adapter : 'sails-mongo', // leave this one alone
      host    : '', // this is the address of the Mongo server
      port    : 47799, // the port to connect to Mongo on, no need to modify
      user    : '',
      password: '',
      database: ''
    }
  }
};
