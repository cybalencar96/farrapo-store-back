import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

async function getPurchaseHistory(req, res) {
    try {
        const history = await db.purchaseHistory.get(res.locals.token);
        return res.send(history)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getHistoryByPurchaseToken(req, res) {
    try {
        const history = await db.purchaseHistory.getByPurchaseToken(res.locals.token);
        return res.send(history)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    getPurchaseHistory,
    getHistoryByPurchaseToken,
}