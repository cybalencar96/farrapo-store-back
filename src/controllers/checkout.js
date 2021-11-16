import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

function areItemObjectsEqual(receivedItem, savedItem) {
    const atributesToCompare = ["userId", "itemId", "cartQty", "price", "maxQty"];
    let areItemsEqual = true;
    for (let i = 0; i < atributesToCompare.length; i++) {
        const atribute = atributesToCompare[i];
        if (receivedItem[atribute] !== savedItem[atribute]) {
            areItemsEqual = false;
            break
        }
    }
    return areItemsEqual;
}

async function transferFromCartToHistory(req, res) {
    const {
        cart,
        userData
    } = req.body;

    try {
        const userId = (await db.users.get("session", res.locals.token))?.user_id;

        if (!userId) {
            return res.sendStatus(401);
        }

        const savedCart = await db.cart.getCartFromUser({ userId });

        if (cart.length !== savedCart.length) {
            return res.sendStatus(400);
        }

        for (let i = 0; i < cart.length; i++) {
            const receivedItem = cart[i];
            const savedItem = savedCart.find(({itemId}) => itemId === receivedItem.itemId);
            if (!savedItem || !areItemObjectsEqual(receivedItem, savedItem)) {
                return res.sendStatus(400);
            }
        }

        const token = await db.purchaseHistory.addSeveral(cart);
        await db.cart.deleteUserCart({clientType: "user", token: res.locals.token});
        await db.items.updateQuantity(cart);


        res.status(200).send({token});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    transferFromCartToHistory,
};