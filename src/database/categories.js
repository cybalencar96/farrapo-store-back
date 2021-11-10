import connection from "./connection.js";

async function add(categoryName) {
    const result = await connection.query(`INSERT INTO categories (name) VALUES ($1) RETURNING *;`,[categoryName])
    return result.rows[0];
}

async function get({categories, randomCategory, limit}) {
    let result;
    if (!randomCategory && !limit) {
        let queryText = `SELECT * FROM categories WHERE `
        categories.forEach((category, index) => {
            queryText += `name = $${index + 1}`
            if (index !== categories.length - 1) {
                queryText += " OR "
            }
        })
        result = await connection.query(`${queryText};`, categories);
    } else {
        result = await connection.query(`SELECT * FROM categories ORDER BY RANDOM() LIMIT $1;`,[limit]);
    }

    return result.rows;
}

const categoriesFactory = {
    add,
    get,
}

export default categoriesFactory;