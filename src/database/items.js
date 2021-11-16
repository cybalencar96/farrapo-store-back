import connection from './connection.js';
import { translateDiacriticsQuery } from '../utils/sharedFunctions.js'

async function get(filters = {}) {
    const {
        id,
        maximumPrice,
        searchedName,
        orderBy,
        colors,
        categories,
        sizes,
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

    if (!!searchedName) {
        queryArray.push(`%${searchedName}%`);
        queryText += ` AND ${translateDiacriticsQuery("aux.name")} iLIKE ${translateDiacriticsQuery(`$${queryArray.length}`)}`
    }

    if (!!colors && !!colors.length) {
        queryText += ` AND (`
        colors.forEach((color, index) => {
            queryArray.push(color);
            queryText += ` ${translateDiacriticsQuery("aux.color")} iLIKE ${translateDiacriticsQuery(`$${queryArray.length}`)}`
            if (index !== colors.length - 1) {
                queryText += " OR";
            }
        })
        queryText += " )";
    }

    if (!!categories && !!categories.length) {
        queryText += ` AND (`
        categories.forEach((category, index) => {
            queryArray.push(`%${category}%`);
            queryText += ` ${translateDiacriticsQuery("aux.category")} iLIKE ${translateDiacriticsQuery(`$${queryArray.length}`)}`
            if (index !== categories.length - 1) {
                queryText += " OR";
            }
        })
        queryText += " )";
    }

    if (!!sizes && !!sizes.length) {
        queryText += ` AND (`
        sizes.forEach((size, index) => {
            queryArray.push(`%${size}%`);
            queryText += ` ${translateDiacriticsQuery("aux.size")} iLIKE ${translateDiacriticsQuery(`$${queryArray.length}`)}`
            if (index !== sizes.length - 1) {
                queryText += " OR";
            }
        })
        queryText += " )";
    }

    const possibleOrderByOptions = ["menor preco", "maior preco", "mais recente", "menos recente"];
    const compatibleOrderByText = ["price ASC", "price DESC", `"createdAt" DESC`, `"createdAt" ASC`];

    const orderByText = !orderBy ? "RANDOM()" : compatibleOrderByText[possibleOrderByOptions.indexOf(orderBy)];

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
    ORDER BY ${orderByText}
    `;

    if (!!limit) {
        queryArray.push(limit);
        queryText += ` LIMIT $${queryArray.length}`
    }

    const result = await connection.query(`${queryText};`, queryArray);

    return result.rows.map(item => ({...item, categories: item.categories.split(',')}))
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

async function updateQuantity(items) {
    let queryText = `UPDATE itens SET quantity = (CASE`;
    const params = [];
    const idIndex = []

    items.forEach(({ itemId, cartQty, maxQty }) => {
        params.push(itemId, Number(maxQty) - Number(cartQty));
        idIndex.push(params.length - 1);
        queryText += ` WHEN id = $${params.length - 1}::integer THEN $${params.length}::integer`;
    })
    queryText += ` END) WHERE id IN ($${idIndex.join(",$")});`
    await connection.query(queryText, params);
    return 
}

const itemsFactory = {
    get,
    add,
    updateQuantity,
};

export default itemsFactory;
