'use strict'

const { BadRequestError } = require('./errors')
const PgObject = require('./pg')

const createEmptyUser = async function (user) {
  const pgClient = new PgObject()
  await pgClient.connect()
  const createdUser = await pgClient.query(`
            INSERT INTO users(name, email, birth) 
            values ('${user.name}','${user.email}',${user.birth ? `'${user.birth}'` : 'NULL'})
            returning *;`)
  await pgClient.end()

  return createdUser.rows[0]
}

const getUserByEmail = async function (searchEmail) {
  if (typeof searchEmail === 'string') {
    const pgClient = new PgObject()
    await pgClient.connect()
    const userReceived = await pgClient.query(`
            SELECT * FROM users
            WHERE users.email='${searchEmail}';   
            `)
    await pgClient.end()
    return userReceived.rows[0]
  } else {
    throw new BadRequestError('To get an email it should be valid')
  }
}

module.exports = {
  createEmptyUser,
  getUserByEmail
}
