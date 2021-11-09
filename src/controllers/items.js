import makeDbFactory from '../database/database.js';
import { areDuplicatesInArray, randomIntFromInterval} from '../utils/sharedFunctions.js';

const db = makeDbFactory();

async function getItems(req, res) {
    try {
        const result = await db.items.get();
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function addCategoryRandomItens(homepageItems, categories) {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const itensForSelectedCategory = await db.items.get({ category, limit: 10 });
        homepageItems.push({ title: category, forwardMessage: "Quero ver mais!", itens: itensForSelectedCategory });
    }
    return;
}

async function getHomepageItems(req, res) {

    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        let loggedUserData = {maximumPrice: "", mostPopularColor: "", categories: [] }
        if (!!token) {
            loggedUserData = await db.purchase_history.getHistoryForHomepage(token);
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
        const itensForSelectedColor = await db.items.get({ color: selectedColor, limit: 10 });

        const homepageItems = [
            { title: `Até R$${maximumPrice},00`, forwardMessage: "Que pechincha!", itens: itensForMaximumPrice },
            { title: `Que tal um pouco de ${selectedColor.toLowerCase()}`, forwardMessage: "Quero ver mais!", itens: itensForSelectedColor },
        ]

        await addCategoryRandomItens(homepageItems, selectedCategories);
        
        return res.send(homepageItems);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function addItems(req, res) {

    const {
        colorName,
        sizeName,
        categories,
    } = req.body;
    
    const isColorInDatabase = await db.colors.get({colorName});
    if (!isColorInDatabase) {
        return res.status(404).send("Sent colorName is not valid");
    }

    const isSizeInDatabase = await db.sizes.get(sizeName);
    if (!isSizeInDatabase) {
        return res.status(404).send("Sent sizeName is not valid");
    }

    const categoriesInDatabase = await db.categories.get({categories});
    if (areDuplicatesInArray(categories) || categoriesInDatabase.length !== categories.length) {
        return res.status(404).send("Sent categories are not valid");
    }
    
    const createdAt = new Date();

    try {
        await db.items.add({...req.body, createdAt});
        return res.sendStatus(201);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    getItems,
    getHomepageItems,
    addItems,
};