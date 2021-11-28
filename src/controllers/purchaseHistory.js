import { makeServices } from "../services/services.js";

const services = makeServices();

async function getPurchaseHistory(req, res) {
    try {
        const { body } = await services.purchaseHistory.getPurchaseHistory({ token: res.locals.token });

        return res.send(body);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getHistoryByPurchaseToken(req, res) {
    try {
        const { body } = await services.purchaseHistory.getByPurchaseToken({ purchaseToken: res.locals.token });
        
        return res.send(body);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    getPurchaseHistory,
    getHistoryByPurchaseToken,
}