import connection from "./connection.js";

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
    get,
    getHistoryForHomepage,
}

export default historyFactory;