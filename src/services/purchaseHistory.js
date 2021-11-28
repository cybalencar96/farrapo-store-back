function makePurchaseHistoryService(db, errorMessage, successMessage) {
    async function getPurchaseHistory({ token }) {
        const history = await db.purchaseHistory.get(token);

        return successMessage({ body: history });
    }

    async function getByPurchaseToken({ purchaseToken }) {
        try {
            const history = await db.purchaseHistory.getByPurchaseToken(purchaseToken);
            return successMessage({ body: history });
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }
    
    return {
        getPurchaseHistory,
        getByPurchaseToken,
    }
}

export {
    makePurchaseHistoryService,
}
