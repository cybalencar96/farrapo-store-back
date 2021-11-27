import { makeServices } from '../services/services.js';

const services = makeServices();

async function getFilters(req, res) {
    try {
        const {body, error} = await services.filters.getFilters();

        if (error) return res.status(400).send(error.text);

        return res.send(body);
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }

}

export {
    getFilters,
}