/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

const HttpClient = require('./httpClient').HttpClient;
const stripMetaDates = require('./stripMetaDates').stripMetaDates;
const peekResult = require('./peekResult').peekResult;

module.exports = {HttpClient, stripMetaDates, peekResult};
