import connection from "./connection.js";

async function add(categoryName) {
    const result = await connection.query(`INSERT INTO categories (name) VALUES ($1) RETURNING *;`,[categoryName])
    return result.rows[0];
}

async function get({arrayOfCategories, randomCategory, limit}) {
    let result;
    if (!randomCategory && !limit) {
        let queryText = `SELECT * FROM categories WHERE `
        arrayOfCategories.forEach((category, index) => {
            queryText += `name = $${index + 1}`
            if (index !== arrayOfCategories.length - 1) {
                queryText += " OR "
            }
        })
        result = await connection.query(`${queryText};`, arrayOfCategories);
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