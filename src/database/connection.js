import pg from 'pg'

const { Pool } = pg;

const connectionData = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: process.env.PORT,
    database: process.env.DB_NAME,
}
console.log(connectionData)

const connection = new Pool(connectionData);

export default connection;