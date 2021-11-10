import makeDbFactory from '../database/database.js';
import { areDuplicatesInArray, randomIntFromInterval} from '../utils/sharedFunctions.js';
import { removeDuplicatesInArray } from '../utils/sharedFunctions.js';

const db = makeDbFactory();

async function getItems(req, res) {
    try {
        const items = await db.items.get({...req.query, limit: 20});

        const idArray =  items.map(item => item.id);
        const uniqueItemsIds = removeDuplicatesInArray(idArray);
        
        const uniqueItems = items.filter(item => {
            const indexOfId = uniqueItemsIds.indexOf(item.id) 
            if (indexOfId > -1) {
                uniqueItemsIds.splice(indexOfId, 1);
                return true
            }
        });

        const structuredItems = uniqueItems.map(item => {
            const newItem = {...item}
            newItem.categories = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].id === item.id) {
                    newItem.categories.push(items[i].categories)
                }
            }

            return newItem;
        })

        return res.send(structuredItems);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getItem(req, res) {
    const id = req.params.id;

    try {
        const result = await db.items.get({ id });
        if (!result) return res.sendStatus(404);
        
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function addCategoryRandomItens(homepageItems, randomCategories) {
    for (let i = 0; i < randomCategories.length; i++) {
        const category = randomCategories[i];
        const itensForSelectedCategory = await db.items.get({ category: category.name, limit: 10 });
        homepageItems.push({ title: category.name, forwardMessage: "Quero ver mais!", itens: itensForSelectedCategory });
    }
    return;
}

async function getHomepageItems(req, res) {
    
    const maximumPrice = randomIntFromInterval(3, 8) * 10;

    try {
        const randomColor = (await db.colors.get({ randomColor: true }))?.name;
        const randomCategories = await db.categories.get({ randomCategory: true, limit: 3 });
        const itensForMaximumPrice = await db.items.get({ maximumPrice, limit: 10 });
        const itensForSelectedColor = await db.items.get({ color: randomColor, limit: 10 });

        const homepageItems = [
            { title: `Até R$${maximumPrice},00`, forwardMessage: "Que pechincha!", itens: itensForMaximumPrice },
            { title: `Que tal um pouco de ${randomColor}`, forwardMessage: "Quero ver mais!", itens: itensForSelectedColor },
        ]

        await addCategoryRandomItens(homepageItems, randomCategories);
        
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