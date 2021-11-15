import connection from "./connection.js";

async function add({ userId, itemId, quantity, price, date }) {
    const params = [userId, itemId, quantity, price];
    date ? params.push(date) : '';

    const result = await connection.query(`
        INSERT INTO purchase_history (user_id, item_id, quantity, price ${date ? ', date': ''}) 
        VALUES ($1,$2,$3,$4 ${date ? ', $5' : ''}) RETURNING *;
    `, params);

    return result.rows[0];
}

async function addSeveral(items) {
    let queryText = "INSERT INTO purchase_history (user_id, item_id, quantity, price, date) VALUES "
    const params = [];
    const today = new Date();
    items.forEach(({userId, itemId, cartQty, price}, index) => {
        params.push(userId, itemId, cartQty, price, today);
        queryText += `($${params.length - 4}, $${params.length - 3}, $${params.length - 2}, $${params.length - 1}, $${params.length})`
        if (items.length - 1 !== index) {
            queryText += " , "
        }
    })
    
    await connection.query(`${queryText};`, params);
    return;
}

async function get(token) {
    const firstResult = await connection.query(`
    SELECT
        itens.id,
        itens.name,
        itens.description,
        colors.name AS "colorName",
        sizes.name AS "sizeName",
        itens.image_url AS "image",
        purchase_history.quantity,
        purchase_history.price,
        purchase_history.date
    FROM
        purchase_history
    JOIN sessions
        ON sessions.user_id = purchase_history.user_id
    JOIN itens
        ON purchase_history.item_id = itens.id
    JOIN sizes
        ON itens.size_id = sizes.id
    JOIN colors
        ON colors.id = itens.color_id
    WHERE sessions.token=$1;`, [token]);
    const purchasedItens = firstResult.rows;

    const secondResult = await connection.query(`
        SELECT
        purchase_history.item_id AS "itemId",
        categories.name AS "categoryName"
    FROM
        purchase_history
    JOIN sessions
        ON sessions.user_id = purchase_history.user_id
    JOIN itens_and_categories
        ON itens_and_categories.item_id = purchase_history.item_id
    JOIN categories
        ON categories.id = itens_and_categories.category_id
    WHERE sessions.token = $1;`, [token]);
    const categories = secondResult.rows;

    purchasedItens.forEach(item => {
        item.categories = categories.filter(({ itemId }) => itemId === item.id).map( category => category.categoryName);
        delete item.id;
    })
    
    return purchasedItens;
}

async function getHistoryForHomepage(token) {
    const maximumPriceQuery = await connection.query(`
    SELECT
        MAX(purchase_history.price)
    FROM
        purchase_history
    JOIN sessions
        ON sessions.user_id = purchase_history.user_id
    WHERE sessions.token=$1;`, [token]);
    const maximumPaidPrice = maximumPriceQuery.rows[0]?.max;

    let maximumRoundedPrice;
    if (!!maximumPaidPrice) {
        const roundedUpPaidPrice = Math.ceil(maximumPaidPrice / 10) * 10;
        if (roundedUpPaidPrice < 30) {
            maximumRoundedPrice = 30;
        } else if (roundedUpPaidPrice > 80) {
            maximumRoundedPrice = 80;
        } else {
            maximumRoundedPrice = roundedUpPaidPrice;
        }
    }

        const colorsQuery = await connection.query(`
        SELECT
        colors.name AS "color"
    FROM
        purchase_history
    JOIN sessions
        ON sessions.user_id = purchase_history.user_id
    JOIN itens
        ON purchase_history.item_id = itens.id
    JOIN colors
        ON colors.id = itens.color_id
    WHERE sessions.token = $1
    GROUP BY colors.name
    ORDER BY SUM(purchase_history.quantity) DESC
    LIMIT 1
    ;`, [token]);
    const mostPopularColor = colorsQuery.rows[0]?.color;


    const categoriesQuery = await connection.query(`
        SELECT
        categories.name AS "categoryName"
    FROM
        purchase_history
    JOIN sessions
        ON sessions.user_id = purchase_history.user_id
    JOIN itens_and_categories
        ON itens_and_categories.item_id = purchase_history.item_id
    JOIN categories
        ON categories.id = itens_and_categories.category_id
    WHERE sessions.token = $1
    GROUP BY categories.name
    ORDER BY SUM(purchase_history.quantity) DESC
    LIMIT 3
    ;`, [token]);
    const categories = categoriesQuery.rows;

    return (
        {
            maximumPrice: maximumRoundedPrice,
            categories: categories.map(({ categoryName }) => categoryName),
            mostPopularColor
        }
    );

}

const historyFactory = {
    add,
    get,
    getHistoryForHomepage,
    addSeveral,
}

export default historyFactory;