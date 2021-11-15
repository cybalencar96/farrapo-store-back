import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

function areItemObjectsEqual(receivedItem, savedItem) {
    const atributesToCompare = ["userId", "itemId", "cartQty", "price"];
    let areItemsEqual = true;
    atributesToCompare.forEach(atribute => {
        if (receivedItem[atribute] !== savedItem[atribute]) {
            console.log(receivedItem, savedItem, atribute)
            areItemsEqual = false;
        }
    })
    return areItemsEqual;
}

async function transferFromCartToHistory(req, res) {
    const {
        cart,
        userData
    } = req.body;

    try {
        const userId = (await db.users.get("session", res.locals.token)).user_id;
        const savedCart = await db.cart.getCartFromUser({ userId });

        if (cart.length !== savedCart.length) {
            console.log(savedCart, cart)
            return res.sendStatus(400);
        }

        for (let i = 0; i < cart.length; i++) {
            const receivedItem = cart[i];
            const savedItem = savedCart[i];
            if (!areItemObjectsEqual(receivedItem, savedItem)) {
                return res.sendStatus(400);
            }
        }

        await db.purchaseHistory.addSeveral(cart);
        await db.cart.deleteUserCart({clientType: "user", token: res.locals.token})
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    transferFromCartToHistory,
};