import pg from 'pg'

const { Pool } = pg;

const connectionData = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const connection = new Pool(connectionData);

export default connection;