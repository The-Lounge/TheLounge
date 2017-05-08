/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
require('any-promise/register/q');
const request = require('request-promise-any');

class HttpClient {
  /**
   * @param params
   * @param [params.baseUrl {string}]
   */
  constructor(params) {
    this.jar = request.jar();
    this._request = request.defaults({
      jar: this.jar,
      json: true,
      baseUrl: params.baseUrl,
    });
  }

  request(options) {
    return this._request(options);
  }

  authenticate(url, credentials) {
    return this._request.post({url, body: credentials});
  }

  get(url) {
    return this._request.get({url});
  }

  post(url, body) {
    return this._request.post({url, body});
  }

  put(url, body) {
    return this._request.put({url, body});
  }
}

module.exports = {HttpClient};
