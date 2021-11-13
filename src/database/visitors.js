import connection from "./connection.js";

async function add(visitorToken) {
    const result = await connection.query(`INSERT INTO visitors (token) VALUES ($1) RETURNING *;`,[visitorToken])
    return result.rows[0];
}

async function get(visitorToken) {
    const result = await connection.query(`SELECT * FROM visitors WHERE token = $1 LIMIT 1;`,[visitorToken]);
    return result.rows[0];
}

const visitorsFactory = {
    add,
    get,
}

export default visitorsFactory;