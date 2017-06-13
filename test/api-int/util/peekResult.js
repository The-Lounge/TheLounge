/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
const nodeUtil = require('util');

function peekResult(result) {
  console.log(nodeUtil.inspect(result));
  return result;
}

module.exports = {peekResult};
