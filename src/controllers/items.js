import { makeServices } from '../services/services.js';

const services = makeServices();

async function getItems(req, res) {
    try {
        const adjustedQuery = {
            colors: req.query.color ? [req.query.color] : '',
            categories: req.query.category ? [req.query.category] : '',
        }

        const { body } = await services.items.getItems({...adjustedQuery, limit: 20});

        return res.send(body);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getItem(req, res) {
    const id = req.params.id;

    try {
        const { body, error } = await services.items.getItem({ id });
        
        if (error) {
            return res.status(400).send(error.text);
        }

        return res.status(200).send({
            ...body,
            categories: body.categories.split(',')
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getHomepageItems(req, res) {

    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        const { body } = await services.items.getHomepageItems({ token });

        return res.send(body);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function addItems(req, res) {
    try {
        const { error } = await services.items.addItems(req.body);

        if (error) {
            return res.status(400).send(error.text);
        }

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