module.exports = require('@jupiterone/integration-sdk-dev-tools/config/jest');
module.exports = {
  ...require('@jupiterone/integration-sdk-dev-tools/config/jest'),
  setupFiles: ['dotenv/config'],
};
