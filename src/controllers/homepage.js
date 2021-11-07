import makeDbFactory from '../database/database.js';

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

async function addItems(req, res) {
    const {
        name,
        description,
        price,
        colorName,
        sizeName,
        quantity,
        imageUrl,
        createdAt,
        categories
    } = req.body;

    try {
        await db.items.add(req.body);

        return res.sendStatus(201);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    getItems,
    addItems,
};