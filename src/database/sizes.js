import connection from "./connection.js";

async function add(sizes) {
    let queryText = "INSERT INTO sizes (name) VALUES ";
    sizes.forEach((size, index) => {
        queryText += `($${index + 1})`;
        if (index !== sizes.length - 1) {
            queryText += ", ";
        }
    })
    queryText += "RETURNING *"
    const result = await connection.query(`${queryText};`, sizes);
    return result.rows;
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