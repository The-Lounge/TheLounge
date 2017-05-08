/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

function applyMockId(settings) {
  if (sails.config.environment === 'mock') {
    settings.attributes.id = {
      type: 'string',
      primaryKey: true,
      unique: true,
      defaultsTo: () => Math.random().toString(36).slice(2)};
  }
}

module.exports = {applyMockId};
