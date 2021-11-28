function makeFiltersService(db, errorMessage, successMessage) {
    async function getFilters() {
        const result = await db.getAllFilters();

        if (!result) return errorMessage({text: 'could not get filters'});

        return successMessage({
            body: {
                categories: result[0],
                colors: result[1],
                sizes: result[2],
            }
        });
    }

    return {
        getFilters,
    }
}

export {
    makeFiltersService,
}