/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

function applyMockId(settings) {
  if (sails.config.environment === 'mock') {
    settings.attributes.id = {
      type: 'string',
      primaryKey: true,
      unique: true,
      defaultsTo: () => String.fromCharCode(~~(Math.random() * 100)) + ~~(Math.random() * 1000) };
  }
}

module.exports = {applyMockId};
