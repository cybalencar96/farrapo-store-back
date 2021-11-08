import connection from "./connection.js";

async function add(sizeName) {
    const result = await connection.query(`INSERT INTO sizes (name) VALUES ($1) RETURNING *;`,[sizeName])
    return result.rows[0];
}

async function get(sizeName) {
    const result = await connection.query(`SELECT * FROM sizes WHERE name=$1 LIMIT 1;`,[sizeName]);
    return result.rows[0];
}

const sizesFactory = {
    add,
    get,
}

export default sizesFactory;