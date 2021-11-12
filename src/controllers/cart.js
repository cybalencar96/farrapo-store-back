import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

async function addToCart(req, res) {
    const {
        itemId,
        userId,
        visitorToken,
    } = req.body

    try {
        if ((!userId && !visitorToken) || (userId && visitorToken)) {
            return res.status(400).send('send one id');
        }

        if (userId) {
            const itemInCart = await db.cart.get({ itemId, userId });
            if (itemInCart) return res.status(409).send('item already in cart');
        }

        if (visitorToken) {
            const itemInCart = await db.cart.get({ itemId, visitorToken });
            if (itemInCart) return res.status(409).send('item already in cart');
        }

        const item = await db.items.get({ id: itemId })
        if (!item) {
            return res.status(404).send('item not found');
        }

        const user = await db.users.get('byId', userId)
        if (userId && !user) {
            console.log(userId, !user)
            return res.status(404).send('user not found');
        }

        const itemInCart = await db.cart.getItemQtyInCart(itemId);
        if (itemInCart && itemInCart.qtyInCart >= itemInCart.maxQty) {
            return res.status(403).send('max dynamic quantity reached');
        }

        const cartItemId = await db.cart.addItem(req.body)

        return res.send({ cartItemId });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function updateQty(req, res) {
    const { cartId, quantity } = req.body
    try {
        const cartItem = await db.cart.get({ id: cartId });
        if (!cartItem) {
            return res.status(404).send('cart item not found');
        }
        
        const itemInCart = await db.cart.getItemQtyInCart(cartItem.item_id);
        if (itemInCart && quantity > itemInCart.maxQty) {
            return res.status(403).send('quantity surpasses limit');
        }

        await db.cart.changeQty(req.body);
        return res.sendStatus(200)  
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getUserCart(req, res) {
    const { userId, visitorToken } = req.query;

    try {
        if ((!userId && !visitorToken) || (userId && visitorToken)) {
            return res.status(400).send('send one id');
        }

        let visitor = {};
        if (visitorToken) {
            visitor = await db.visitors.get(visitorToken);
            if (!visitor) return res.status(400).send('token invalid');
        }

        if (userId) {
            const user = await db.users.get('byId', userId);
            if (!user) return res.status(400).send('user invalid');
        }

        const userCart = await db.cart.getCartFromUser({userId, visitorId: visitor.id});
        return res.send(userCart)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    addToCart,
    updateQty,
    getUserCart,
}