import makeDbFactory from '../database/database.js';

const db = makeDbFactory();

async function getFilters(req, res) {
    try {
        const result = await db.getAllFilters()
        return res.send({
            categories: result[0],
            colors: result[1],
            sizes: result[2]
        });
    } catch (error) {
        console.log(error);
        resizeBy.sendStatus(500)
    }

}

export {
    getFilters,
}