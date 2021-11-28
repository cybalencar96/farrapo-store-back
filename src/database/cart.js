import connection from "./connection.js";

async function get(cartInfos = {}) {
    const {
        id,
        userId,
        itemId,
        visitorId,
    } = cartInfos;

    let query = 'SELECT * FROM cart WHERE 1=1 ';

    if (id) {
        query += 'AND id = $1'
        return (await connection.query(query,[id])).rows[0];
    }

    if (userId) {
        query +='AND user_id = $1 AND item_id = $2';
        return (await connection.query(query,[userId, itemId])).rows[0];
    }
    
    if (visitorId) {
        query += 'AND item_id = $1 AND visitor_id = $2';
        const cartItem = await connection.query(query, [itemId, visitorId]);

        return cartItem.rows[0];
    }
}

async function addItem(cartInfos = {}) {
    const {
        userId,
        itemId,
        quantity,
        visitorId,
    } = cartInfos;

    let clientId;
    let clientColumn;

    if (visitorId) {
        clientId = visitorId;
        clientColumn = 'visitor_id';
    }

    if (userId) {
        clientId = userId;
        clientColumn = 'user_id';
    }

    const result =  await connection.query(`
        INSERT INTO cart (item_id, quantity, ${clientColumn}) 
        VALUES ($1, $2, $3) RETURNING id
    `,[itemId, quantity, clientId]);

    const addedItem = await connection.query(`
        SELECT 
            itens.name AS "itemName",
            cart.quantity as "cartQty",
            itens.quantity AS "maxQty",
            itens.price,
            itens.image_url AS "imageUrl",
            itens.description,
            sizes.name AS size,
            cart.id,
            cart.visitor_id as "visitorId",
            itens.id AS "itemId",
            users.id AS "userId",
            users.name AS "userName"
        FROM cart 
        LEFT JOIN users ON users.id = cart.user_id
        LEFT JOIN itens ON itens.id = cart.item_id
        LEFT JOIN sizes ON sizes.id = itens.size_id
        WHERE cart.id = $1;
    `,[result.rows[0].id])

    return addedItem.rows[0];
}

async function getCartFromUser({userId, visitorId}) {
    const clientId = userId ? userId : visitorId;
    const clientColumn = userId ? 'user_id' : 'visitor_id';

    let query = `
        SELECT 
            itens.name AS "itemName",
            cart.quantity as "cartQty",
            itens.quantity AS "maxQty",
            itens.price,
            itens.image_url AS "imageUrl",
            itens.description,
            sizes.name AS size,
            cart.id,
            cart.visitor_id as "visitorId",
            itens.id AS "itemId",
            users.id AS "userId",
            users.name AS "userName"
        FROM cart 
        LEFT JOIN users ON users.id = cart.user_id
        LEFT JOIN itens ON itens.id = cart.item_id
        LEFT JOIN sizes ON sizes.id = itens.size_id
        WHERE ${clientColumn} = $1;
    `;

    const cartItems = await connection.query(query,[clientId]);
    return cartItems.rows;
}

async function getItemQtyInCart(itemId) {
    let query = `
        SELECT 
            itens.id AS "itemId",
            itens.name AS "itemName",
            itens.quantity AS "maxQty",
            SUM(cart.quantity) AS "qtyInCart"
        FROM cart 
        JOIN itens ON itens.id = cart.item_id
        WHERE itens.id = $1
        GROUP BY 
            itens.id
           ; 
    `

    const result = await connection.query(query,[itemId]);

    return result.rows[0];
}

async function updateItemQty({ clientType, token, itemId, quantity }) {
    const cartColumn = clientType.toLowerCase() === "user" ? 'user_id' : 'visitor_id';
    const searchTableColumn = clientType.toLowerCase() === "user" ? 'user_id' : 'id';
    const tableToLookFrom = clientType.toLowerCase() === "user" ? "sessions" : "visitors";

    const updatedItem = await connection.query(`
    UPDATE cart SET quantity = $1
    WHERE ${cartColumn} = (SELECT ${searchTableColumn} FROM ${tableToLookFrom} WHERE token = $2 ) AND item_id = $3 RETURNING *;`, [quantity, token, itemId]);
    return updatedItem.rows[0];
}

async function deleteUserCart ({clientType, token}) {
    const cartColumn = clientType.toLowerCase() === "user" ? 'user_id' : 'visitor_id';
    const searchTableColumn = clientType.toLowerCase() === "user" ? 'user_id' : 'id';
    const tableToLookFrom = clientType.toLowerCase() === "user" ? "sessions" : "visitors";

    const result = await connection.query(`
        DELETE FROM cart
        WHERE ${cartColumn} = (SELECT ${searchTableColumn} FROM ${tableToLookFrom} WHERE token = $1 ) RETURNING *;`, [token]);
    return result.rowCount;
}

async function deleteItemFromUserCart({clientType, token, itemId}) {
    const cartColumn = clientType.toLowerCase() === "user" ? 'user_id' : 'visitor_id';
    const searchTableColumn = clientType.toLowerCase() === "user" ? 'user_id' : 'id';
    const tableToLookFrom = clientType.toLowerCase() === "user" ? "sessions" : "visitors";

    const result = await connection.query(`
        DELETE FROM cart
        WHERE ${cartColumn} = (SELECT ${searchTableColumn} FROM ${tableToLookFrom} WHERE token = $1 ) AND item_id = $2 RETURNING *;`, [token, itemId]);
    return result.rows[0];
}

async function transferItems({userId, visitorId}) {
    await connection.query(`
        UPDATE cart 
        SET user_id = $1, visitor_id = NULL
        WHERE visitor_id = $2;
    `, [userId, visitorId]);
}

const cartFatory = {
    getCartFromUser,
    addItem,
    getItemQtyInCart,
    updateItemQty,
    get,
    deleteUserCart,
    deleteItemFromUserCart,
    transferItems,
}


export default cartFatory;
