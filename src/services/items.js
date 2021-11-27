function makeItemsService(db, errorMessage, successMessage) {
    async function getItems({colors, categories, limit}) {
        const items = await db.items.get({ colors, categories, limit });

        return successMessage({body: items});
    }

    return {
        getItems,
    }
}

export {
    makeItemsService,
}