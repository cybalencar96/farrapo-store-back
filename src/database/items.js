import connection from './connection.js';

async function get({ maximumPrice, color, category, limit }) {
    
    let queryText = `
    SELECT temp.* FROM 
        (SELECT DISTINCT
            itens.name,
            itens.description,
            itens.price,
            colors.name AS color,
            sizes.name AS size,
            itens.quantity,
            itens.image_url AS image,
            itens.created_at AS "createdAt"
        FROM itens
        JOIN colors 
            ON itens.color_id = colors.id
        JOIN sizes 
            ON itens.size_id = sizes.id
        JOIN itens_and_categories
            ON itens.id = itens_and_categories.item_id
        JOIN categories
            ON categories.id = itens_and_categories.category_id
        WHERE 1=1`;
    const queryArray = [];

    if (!!maximumPrice) {
        queryArray.push(maximumPrice);
        queryText += ` AND itens.price < $${queryArray.length}`
    }
    if (!!color) {
        queryArray.push(color);
        queryText += ` AND colors.name = $${queryArray.length}`
    }
    if (!!category) {
        queryArray.push(category);
        queryText += ` AND categories.name = $${queryArray.length}`
    }
    queryText += `) AS temp ORDER BY RANDOM()`;
    if (!!limit) {
        queryArray.push(limit);
        queryText += ` LIMIT $${queryArray.length}`
    }

    const result = await connection.query(`${queryText};`,queryArray);
    return result.rows;
}

async function add(itemData) {

    const {
        name,
        description,
        price,
        colorName,
        sizeName,
        quantity,
        imageUrl,
        createdAt,
        categories,
    } = itemData;

    const insertedId = await connection.query(
        `INSERT INTO itens
            (name, description, price, color_id, size_id, quantity, image_url, created_at)
        VALUES
            ($1, $2, $3, (SELECT id FROM colors WHERE name = $4), (SELECT id FROM sizes WHERE name = $5), $6, $7, $8) RETURNING id;`,
        [
            name,
            description,
            price,
            colorName,
            sizeName,
            quantity,
            imageUrl,
            new Date(createdAt),
        ],
    );

    let itemsAndCategoriesQuery = `INSERT INTO itens_and_categories (item_id, category_id) VALUES `;
    categories.forEach((category, index) => {
        itemsAndCategoriesQuery += `($1, (SELECT id FROM categories WHERE name = $${index + 2}))`;
        if (index !== categories.length - 1) {
            itemsAndCategoriesQuery += ", ";
        }
    })

    await connection.query(`${itemsAndCategoriesQuery};`, [insertedId.rows[0].id, ...categories]);

    return;
}

const itemsFactory = {
    get,
    add
};

export default itemsFactory;