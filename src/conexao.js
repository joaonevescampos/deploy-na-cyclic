require('dotenv').config()

const knex = require('knex')({
    client: process.env.DB_CLIENT,
    connection: {
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    }
});

module.exports = knex