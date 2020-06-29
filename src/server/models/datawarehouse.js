import knex from "knex";

const {
  WAREHOUSE_DB_TYPE,
  WAREHOUSE_DB_HOST,
  WAREHOUSE_DB_PORT,
  WAREHOUSE_DB_NAME,
  WAREHOUSE_DB_PASSWORD,
  WAREHOUSE_DB_USER,
  // DB_SCHEMA,
  WAREHOUSE_USE_SSL = "false",
  WAREHOUSE_IP_BURGER
} = process.env;

const useSSL = WAREHOUSE_USE_SSL === "1"
  || WAREHOUSE_USE_SSL.toLowerCase() === "true";

let config;

if (WAREHOUSE_DB_TYPE) {
  config = {
    client: WAREHOUSE_DB_TYPE,
    connection: {
      host: WAREHOUSE_DB_HOST,
      port: WAREHOUSE_DB_PORT,
      database: WAREHOUSE_DB_NAME,
      password: WAREHOUSE_DB_PASSWORD,
      user: WAREHOUSE_DB_USER,
      ssl: useSSL
    }
  };
}

if (WAREHOUSE_IP_BURGER) {
  const SocksConnection = require('socksjs');
  const proxyUrl = process.env.IPB_SOCKS5;
  const proxyValues = proxyUrl.split(new RegExp('[/(:\\/@)/]+'));
  const warehouse = {
    host: WAREHOUSE_DB_HOST,
    port: WAREHOUSE_DB_PORT
  }
  const proxyConnection = new SocksConnection(warehouse, {
    user: proxyValues[0],
    pass: proxyValues[1],
    host: proxyValues[2],
    port: proxyValues[3],
  });

  config = {
    client: WAREHOUSE_DB_TYPE,
    connection: {
      stream: proxyConnection,
      database: WAREHOUSE_DB_NAME,
      password: WAREHOUSE_DB_PASSWORD,
      user: WAREHOUSE_DB_USER,
      ssl: useSSL
    }
  }
}

export default WAREHOUSE_DB_TYPE ? () => knex(config) : null;
