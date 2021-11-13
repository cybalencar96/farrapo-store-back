import makeDbFactory from '../database/database.js';

const db = makeDbFactory();

async function getFilters(req, res) {
    try {
        return res.send(await db.getAllFilters());
    } catch (error) {
        console.log(error);
        resizeBy.sendStatus(500)
    }

}

export {
    getFilters,
}