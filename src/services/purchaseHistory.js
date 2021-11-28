function makePurchaseHistoryService(db, errorMessage, successMessage) {
    async function getPurchaseHistory({ token }) {
        const history = await db.purchaseHistory.get(token);

        return successMessage({ body: history });
    }

    async function getByPurchaseToken({ purchaseToken }) {
        const history = await db.purchaseHistory.getByPurchaseToken(purchaseToken);
        
        return successMessage({ body: history });
    }
    
    return {
        getPurchaseHistory,
        getByPurchaseToken,
    }
}

export {
    makePurchaseHistoryService,
}
