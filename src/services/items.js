import { areDuplicatesInArray, randomIntFromInterval} from '../utils/sharedFunctions.js';

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

    async function getHomepageItems({ token }) {
        let loggedUserData = {maximumPrice: "", mostPopularColor: "", categories: [] }
        if (!!token) {
            loggedUserData = await db.purchaseHistory.getHistoryForHomepage(token);
        }
        const maximumPrice = loggedUserData.maximumPrice ? loggedUserData.maximumPrice : randomIntFromInterval(3, 8) * 10;
        const selectedColor = loggedUserData.mostPopularColor ? loggedUserData.mostPopularColor : (await db.colors.get({ randomColor: true }))?.name;
        const selectedCategories = [...loggedUserData.categories];
        if (selectedCategories.length < 3) {
            const randomCategories = (await db.categories.get({ randomCategory: true, limit: 3 })).map( ({name}) => name);
            for (let i = 0; i < randomCategories.length; i++) {
                const categoryToBeAdded = randomCategories[i];
                if (!selectedCategories.includes(categoryToBeAdded)) {
                    selectedCategories.push(categoryToBeAdded);
                }
                if (selectedCategories.length === 3) break;
            }
        }
        const itensForMaximumPrice = await db.items.get({ maximumPrice, limit: 10 });
        const itensForSelectedColor = await db.items.get({ colors: [selectedColor], limit: 10 });

        const homepageItems = [
            { title: `Até R$${maximumPrice},00`, forwardMessage: "Que pechincha!", type: "price", itens: itensForMaximumPrice },
            { title: `Que tal um pouco de ${selectedColor.toLowerCase()}`, type: "colors", forwardMessage: "Quero ver mais!", itens: itensForSelectedColor },
        ]

        await addCategoryRandomItens(db, homepageItems, selectedCategories);

        return successMessage({ body: homepageItems });
    }

    async function addItems(itemInfos) {
        const {
            name,
            description,
            price,
            colorName,
            sizeName,
            quantity,
            imageUrl,
            categories,
        } = itemInfos;

        const isColorInDatabase = await db.colors.get({ colorName });
        if (!isColorInDatabase) {
            return errorMessage({ text: 'Sent colorName is not valid'});
        }
    
        const isSizeInDatabase = await db.sizes.get(sizeName);
        if (!isSizeInDatabase) {
            return errorMessage({ text: 'Sent sizeName is not valid'});
        }
    
        const categoriesInDatabase = await db.categories.get({ categories });
        if (areDuplicatesInArray(categories) || categoriesInDatabase.length !== categories.length) {
            return errorMessage({ text: 'Sent categories are not valid'});
        }

        const createdAt = new Date();

        await db.items.add({
            name,
            description,
            price,
            colorName,
            sizeName,
            quantity,
            imageUrl,
            categories,
            createdAt,
        });
        
        return successMessage();
    }

    return {
        getItems,
        getItem,
        getHomepageItems,
        addItems,
    }
}

async function addCategoryRandomItens(db, homepageItems, categories) {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const itemsForSelectedCategory = await db.items.get({ categories: [category], limit: 10 });
        homepageItems.push({
            title: category,
            forwardMessage: "Quero ver mais!",
            type: "categories",
            itens: itemsForSelectedCategory
        });
    }
    return;
}

export {
    makeItemsService,
}