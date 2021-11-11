import connection from "./connection.js";

async function add(categories) {
    let queryText = "INSERT INTO categories (name) VALUES ";
    categories.forEach((category, index) => {
        queryText += `($${index + 1})`;
        if (index !== categories.length - 1) {
            queryText += ", ";
        }
    })
    const result = await connection.query(`${queryText};`, categories);
    return;
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