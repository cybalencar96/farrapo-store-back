import connection from "./connection.js";

async function add({colorName, hexCode}) {
    const result = await connection.query(`INSERT INTO colors (name, hex_code) VALUES ($1, $2) RETURNING *;`, [colorName, hexCode]);
    return result.rows[0];
}

async function get({ colorName, randomColor }) {
    let result;
    if (!!colorName) {
        result = await connection.query(`SELECT * FROM colors WHERE name=$1 LIMIT 1;`,[colorName]);
    }
    if (!!randomColor) {
        result = await connection.query(`SELECT * FROM colors ORDER BY RANDOM() LIMIT 1;`);
    }
    return result.rows[0];
}

const colorsFactory = {
    add,
    get,
}

export default colorsFactory;