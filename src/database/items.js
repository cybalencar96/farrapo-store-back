import connection from './connection.js';

async function get(filters = {}) {
    const {
        id,
        maximumPrice,
        color,
        categories,
        limit,
    } = filters;

    let queryText = `
    SELECT
            id,
            name,
            description,
            price,
            image,
            color,
            size,
            quantity,
            "createdAt",
            array_to_string(array_agg(distinct "category"), ',') AS categories
        FROM
            (SELECT 
                itens.id,
                itens.name,
                itens.description,
                itens.price,
                itens.image_url AS image,
                colors.name AS color,
                sizes.name AS size,
                itens.quantity,
                itens.created_at AS "createdAt",
                categories.name AS category
            FROM itens
            JOIN colors 
                ON itens.color_id = colors.id
            JOIN sizes 
                ON itens.size_id = sizes.id
            JOIN itens_and_categories
                ON itens.id = itens_and_categories.item_id
            JOIN categories
                ON categories.id = itens_and_categories.category_id) AS aux
        WHERE 1=1`;
    const queryArray = [];

    if (!!id) {
        queryArray.push(id);
        queryText += `
                AND aux.id = $${queryArray.length}
            GROUP BY
                id,
                name,
                description,
                price,
                image,
                color,
                size,
                quantity,
                "createdAt"
            ORDER BY RANDOM();
        `

        const result = await connection.query(queryText,queryArray);

        return result.rows[0];
    }

    if (!!maximumPrice) {
        queryArray.push(maximumPrice);
        queryText += ` AND aux.price < $${queryArray.length}`
    }
    if (!!color) {
        queryArray.push(color);
        queryText += ` AND aux.color = $${queryArray.length}`
    }
    if (!!categories) {
        categories.forEach(category => {
            queryArray.push(`%${category}%`);
            queryText += ` AND aux.categories ILIKE $${queryArray.length}`
        })
        
    }

    queryText += `
    GROUP BY
            id,
            name,
            description,
            price,
            image,
            color,
            size,
            quantity,
            "createdAt"
    ORDER BY RANDOM()
    `;

    if (!!limit) {
        queryArray.push(limit);
        queryText += ` LIMIT $${queryArray.length}`
    }

    const result = await connection.query(`${queryText};`,queryArray);

    return result.rows
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
            createdAt,
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

    return {
        id: insertedId.rows[0].id,
        name,
        description,
        price,
        colorName,
        sizeName,
        quantity,
        imageUrl,
        createdAt,
        categories,
    };
}

const itemsFactory = {
    get,
    add
};

export default itemsFactory;
