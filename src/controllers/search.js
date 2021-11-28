import makeDbFactory from '../database/database.js';
import { areRawSearchParamsValid} from '../schemas/search.js';
import { makeServices } from '../services/services.js';

const db = makeDbFactory();
const services = makeServices();

async function getSearchItems(req, res) {
    try {
        if (!areRawSearchParamsValid(req.params)) {
            return res.sendStatus(401);
        }

        const { body, error } = await services.search.getSearchItems({ params: req.params });

        if (error) {
            return res.status(401).send(error.text);
        }

        return res.send(body);
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }

}




export {
    getSearchItems,
}