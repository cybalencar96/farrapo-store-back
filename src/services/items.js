function makeItemsService(db, errorMessage, successMessage) {
    async function getItems({colors, categories, limit}) {
        const items = await db.items.get({ colors, categories, limit });

        return successMessage({body: items});
    }

    async function getItem({ id }) {
        const item = await db.items.get({ id });
        if (!item) return errorMessage({ text: 'item not found' });

        return successMessage({ body: item });
    }

    return {
        getItems,
        getItem,
    }
}

export {
    makeItemsService,
}