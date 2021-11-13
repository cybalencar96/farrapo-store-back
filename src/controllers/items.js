import makeDbFactory from '../database/database.js';
import { areDuplicatesInArray, randomIntFromInterval} from '../utils/sharedFunctions.js';

const db = makeDbFactory();

async function getItems(req, res) {
    try {
        const adjustedQuery = {
            colors: req.query.color ? [req.query.color] : '',
            categories: req.query.category ? [req.query.category] : '',
        }
        const items = await db.items.get({...adjustedQuery, limit: 20});

        const structuredItems = items.map(item => ({...item, categories: item.categories.split(',')}))
        return res.send(structuredItems);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getItem(req, res) {
    const id = req.params.id;

    try {
        const item = await db.items.get({ id });
        if (!item) return res.sendStatus(404);
        
        return res.status(200).send({
            ...item,
            categories: item.categories.split(',')
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function addCategoryRandomItens(homepageItems, categories) {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const itensForSelectedCategory = await db.items.get({ categories: [category], limit: 10 });
        homepageItems.push({ title: category, forwardMessage: "Quero ver mais!", type: "categories", itens: itensForSelectedCategory });
    }
    return;
}

async function getHomepageItems(req, res) {

    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
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
    getItem,
};