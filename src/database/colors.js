import connection from "./connection.js";

async function add(colors) {
    let queryText = "INSERT INTO colors (name, hex_code) VALUES ";
    const queryArray = [];
    colors.forEach(({ colorName, hexCode }, index) => {
        queryArray.push(colorName);
        queryArray.push(hexCode);
        queryText += `($${queryArray.length - 1},$${queryArray.length})`;
        if (index !== colors.length - 1) {
            queryText += ", ";
        }
    })
    queryText += "RETURNING *"
    const result = await connection.query(`${queryText};`, queryArray);
    return result.rows;
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