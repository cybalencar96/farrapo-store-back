import makeDbFactory from "../database/database.js";
import { makeServices } from "../services/services.js";

const db = makeDbFactory();
const services = makeServices();

async function addToCart(req, res) {
    const {
        itemId,
        userId,
        visitorToken,
        quantity
    } = req.body;

    try {
        if ((!userId && !visitorToken) || (userId && visitorToken)) {
            return res.status(400).send('send one id');
        }

        const { body, error } = await services.cart.addItem({itemId, userId, visitorToken, quantity})
        if (error) return res.status(400).send(error.text); 

        return res.send(body);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function updateQty(req, res) {
    const { clientType, token, itemId, quantity } = req.body

    if ((clientType !== "user" && clientType !== "visitor") || quantity <= 0 ) {
        return res.sendStatus(401);
    }

    try {
        const {error, body} = await services.cart.updateItemQty({ clientType, token, itemId, quantity })

        if (error) {
            return res.status(400).send(error.text);
        }

        return res.send(body);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function getUserCart(req, res) {
    const { userId, visitorToken } = req.query;

    try {
        if ((!userId && !visitorToken) || (userId && visitorToken)) {
            return res.status(400).send('send one id');
        }

        const { body, error } = await services.cart.getUserCart({userId, visitorToken});
        if (error) return res.status(400).send(error.text);
        
        return res.send(body)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function removeItemFromCart(req, res) {
    const {
        clientType,
        token,
        itemId,
    } = req.params;

    if (clientType !== "user" && clientType !== "visitor") {
        return res.sendStatus(401);
    }

    try {
        const { body, error } = await services.cart.removeItemFromCart({clientType, token, itemId});
        
        if (error) {
            return res.status(400).send(error.text);
        }

        return res.send(body);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function deleteClientCart(req, res) {
    const {
        clientType,
        token,
    } = req.params;

    if (clientType !== "user" && clientType !== "visitor") {
        return res.sendStatus(401);
    }

    try {
        const { body, error } = await services.cart.deleteUserCart({ clientType, token });

        if (error) {
            return res.sendStatus(400);
        }

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function transferCartVisitantToUser(req, res) {
    const {userId, visitorToken} = req.body;

    try {
        const visitor = await db.visitors.get(visitorToken);
        if (!visitor) {
            return res.status(400).send('invalid visitorId');
        }

        await db.cart.transferItems({ userId, visitorId: visitor.id });
        await db.visitors.remove(visitorToken);
        res.send();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    addToCart,
    updateQty,
    getUserCart,
    removeItemFromCart,
    deleteClientCart,
    transferCartVisitantToUser
}