import makeDbFactory from '../database/database.js';
import { areRawSearchParamsValid } from '../schemas/search.js';

const db = makeDbFactory();

function queryToString(query) {
    let string = query.replace("---", "").replace("-", " ")
    return string;
}

function lowerCaseWithoutDiacritics(string) {
    const specialCharacters = "ÁÉÍÓÚáéíóúâêîôûàèìòùÇç";
    const charactersToReplace = "AEIOUaeiouaeiouaeiouCc";
    const arrayToBeJoined = [];
    string.split("").forEach(character => {
        if (specialCharacters.includes(character)) {
            const characterIndex = specialCharacters.indexOf(character);
            arrayToBeJoined.push(charactersToReplace[characterIndex]);
        } else {
            arrayToBeJoined.push(character)
        }
    })
    return arrayToBeJoined.join("").toLowerCase();
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

async function areFiltersValid(filters) {
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

async function getSearchItems(req, res) {

    if (!areRawSearchParamsValid(req.params)) {
        return res.sendStatus(401);
    }

    const filters = getFiltersObjectFromQuery(req.params);

    try {
        if (!(await areFiltersValid(filters))) {
            return res.sendStatus(401);
        }
        return res.send((await db.items.get({ ...filters, maximumPrice: filters.price })));
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }

}

export {
    getSearchItems,
}