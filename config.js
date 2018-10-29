/*
 * Config file for the application 
 * 
 * 
 */

const environments = {};

environments.stage = {
  http: 3000,
  https: 3001,
  envName: 'stage'
};

environments.prod = {
  http: 5000,
  https: 5001,
  envName: 'prod'
};

const currentEnv =
  typeof process.env.NODE_ENV == 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : '';

const exportedEnvironment =
  typeof environments[currentEnv] == 'object'
    ? environments[currentEnv]
    : environments.stage;

module.exports = exportedEnvironment;
