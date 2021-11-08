import connection from "./connection.js";

async function add(genderName) {
    await connection.query(`INSERT INTO genders (name) VALUES (${genderName});`)
    const result = await connection.query(`SELECT * FROM genders WHERE name='${genderName}' LIMIT 1;`);
    return result.rows[0];
}

async function get(genderName) {
    const result = await connection.query(`SELECT * FROM genders WHERE name='${genderName}' LIMIT 1;`);
    return result.rows[0];
}

const gendersFactory = {
    add,
    get,
}

export default gendersFactory;