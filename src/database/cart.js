import connection from "./connection.js";
import visitorsFactory from "./visitors.js";

async function get(cartInfos = {}) {
    const {
        id,
        userId,
        itemId,
        visitorToken,
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
    
    if (visitorToken) {
        const visitor = await visitorsFactory.get(visitorToken);

        query += 'AND item_id = $1 AND visitor_id = $2';

        const cartItem = await connection.query(query, [itemId, visitor?.id]);
        console.log(cartItem)

        return cartItem.rows[0];
    }
}

async function addItem(cartInfos = {}) {
    const {
        userId,
        itemId,
        quantity,
        visitorToken,
    } = cartInfos;

    let visitor;
    if (visitorToken) {
        visitor = await visitorsFactory.get(visitorToken)
        if (!visitor) {
            visitor = await visitorsFactory.add(visitorToken);
        } 
    }

    const result =  await connection.query(`
        INSERT INTO cart (item_id, quantity, user_id, visitor_id) 
        VALUES ($1, $2, $3, $4) RETURNING id
    `,[itemId, quantity, userId, visitor?.id]);

    return result.rows[0].id;
}

async function getCartFromUser({userId, visitorToken}) {
    let visitor = {};
    if (visitorToken) {
        visitor = await visitorsFactory.get(visitorToken)
    }
    const clientId = userId ? userId : visitor.id;
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
