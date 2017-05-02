/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

/** @type HttpError */
const HttpError = require('standard-http-error');

function getCode(error) {
  let code = error.code;
  if (!code) {
    code = parseInt(/HttpError: (\d{3})/.exec(error.message)[1], 10);
  }
  return code;
}

function processWaterlineError(err, res) {
  const [match, codeString, message] = /HttpError: (\d{3}) (.+)/.exec(err.message) || [];
  const code = parseInt(codeString, 10);

  if (match && Number.isFinite(code) && code !== 500) { // don't try to clean up 500 errors
    const origError = new HttpError(code, message);
    mapError(origError, res);
  } else {
    res.serverError(err);
  }
}

function mapError(err, res) {
  switch (getCode(err)) {
    case HttpError.UNAUTHORIZED:
    case HttpError.UNPROCESSABLE_ENTITY: return res.unauthorized(err);
    case 'E_VALIDATION':
    case HttpError.BAD_REQUEST: return res.badRequest(err);
    case HttpError.NOT_FOUND: return res.notFound(err);
    case 'E_UNKNOWN': return processWaterlineError(err, res);
    default: return res.serverError(err);
  }
}

module.exports = {mapError};
