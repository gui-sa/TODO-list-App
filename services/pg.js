const { Client } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const pgClient = Client.bind(this, { connectionString: process.env.DATABASE_URL })

module.exports = pgClient

// Node cacheia o objeto.
