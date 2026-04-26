require('dotenv').config(); // Add this line

const parseLogging = (value) => {
  if (value === undefined) return false;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'true') return console.log;
  if (normalized === 'false') return false;
  return false;
};

/** @type {import('sequelize').Options} */
module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOSTNAME,
    dialect: process.env.DEV_DB_DIALECT,
    logging: parseLogging(process.env.DEV_DB_LOGGING ?? process.env.DEV_DB_LOGGGIN),
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOSTNAME,
    dialect: process.env.TEST_DB_DIALECT,
    logging: parseLogging(process.env.TEST_DB_LOGGING ?? process.env.TEST_DB_LOGGGIN),
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    dialect: process.env.PROD_DB_DIALECT,
    logging: parseLogging(process.env.PROD_DB_LOGGING ?? process.env.PROD_DB_LOGGGIN),
  },
};
