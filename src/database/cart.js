import connection from "./connection.js";

async function get(cartInfos = {}) {
    const {
        id,
    } = cartInfos;

    const result = await connection.query('SELECT * FROM cart WHERE id = $1', [id]);
    return result.rows[0];
}

async function addItem(cartInfos = {}) {
    const {
        userId,
        itemId,
        quantity,
        visitorId
    } = cartInfos;


    const result =  await connection.query(`
        INSERT INTO cart (item_id, quantity, user_id, visitor_id) 
        VALUES ($1, $2, $3, $4) RETURNING id
    `,[itemId, quantity, userId, visitorId]);

    return result.rows[0].id;
}

async function getCartFromUser({userId, visitorId}) {
    const clientId = userId ? userId : visitorId;
    const clientColumn = userId ? 'user_id' : 'visitor_id';

    let query = `
        SELECT 
            cart.id,
            cart.visitor_id as "visitorId",
            cart.quantity as "cartQty",
            users.name AS "userName",
            users.id AS "userId",
            itens.name AS "itemName",
            itens.id AS "itemId",
            itens.quantity AS "maxQty"
        FROM cart 
        JOIN users ON users.id = cart.user_id
        JOIN itens ON itens.id = cart.item_id
        WHERE ${clientColumn} = $1
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
            
    `

    const result = await connection.query(query,[itemId]);

    return result.rows[0];
}

async function changeQty(qtyInfo) {
    const {
        quantity,
        cartId
    } = qtyInfo;

    return connection.query(`UPDATE cart SET quantity = $1 WHERE id = $2`, [quantity, cartId]);
}

const cartFatory = {
    getCartFromUser,
    addItem,
    getItemQtyInCart,
    changeQty,
    get,
}


export default cartFatory;
