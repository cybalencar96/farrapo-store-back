import { lowerCaseWithoutDiacritics } from '../utils/sharedFunctions.js';

function makeSearchService(db, errorMessage, successMessage) {
    async function getSearchItems({ params }) {
        const filters = getFiltersObjectFromQuery(params);

        if (!(await areFiltersValid(db, filters))) {
            return errorMessage({ text: 'no filters valid'});
        }

        const itemsFiltered = await db.items.get({ ...filters, maximumPrice: filters.price });

        return successMessage({ body: itemsFiltered });
    }

    return {
        getSearchItems,
    }
}

async function areFiltersValid(db, filters) {
    if (filters.price !== "" && (!Number(filters.price) || ![30, 40, 50, 60, 70, 80].includes(Number(filters.price)))) {
        return false;
    }
    if (filters.orderBy !== "" && !["mais recente", "menos recente", "menor preco", "maior preco"].includes(filters.orderBy)) {
        return false;
    }
    const tablesFromDatabase = await db.getAllFilters();
    const [validCategories, validColors, validSizes] = tablesFromDatabase.map(table => table.map(name => lowerCaseWithoutDiacritics(name)));

    const areCategoriesValid = filters.categories.length === (filters.categories.filter(category => validCategories.includes(category))).length;
    const areColorsValid = filters.colors.length === (filters.colors.filter(color => validColors.includes(color))).length;
    const areSizesValid = filters.sizes.length === (filters.sizes.filter(size => validSizes.includes(size))).length;

    return areCategoriesValid && areColorsValid && areSizesValid;
}

function getFiltersObjectFromQuery(params) {
    const {
        searchedName,
        categories,
        colors,
        sizes,
        price,
        orderBy,
    } = params;
    
    const rawStringTypeData = [searchedName, price, orderBy];
    const rawArrayTypeData = [categories, colors, sizes];

    const filteredStringTypeData = rawStringTypeData.map(query => queryToString(query));
    const filteredArrayTypeData = rawArrayTypeData.map(rawData => queryToString(rawData).split("+"));
    const filteredParams = {
        searchedName: filteredStringTypeData[0],
        price: filteredStringTypeData[1],
        orderBy: filteredStringTypeData[2],
        categories: filteredArrayTypeData[0].filter( category => category !== ""),
        colors: filteredArrayTypeData[1].filter( color => color !== ""),
        sizes: filteredArrayTypeData[2].filter( size => size !== "")
    }
    return filteredParams;
}

function queryToString(query) {
    let string = query.replace("---", "").replace("-", " ")
    return string;
}

export {
    makeSearchService,
}