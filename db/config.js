const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  host: 'db42.postgres.database.azure.com',
  user: 'aaoustin',
  password: process.env.DB_PASSWORD,
  database: 'postgres',
  port: 5432,
});

module.exports = pool;
