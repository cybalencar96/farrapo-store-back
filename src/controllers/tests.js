import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

async function clearDb(req, res) {
    if (req.query.cypress !== 'tests') return res.sendStatus(400);
    if (process.env.NODE_ENV !== 'test') return res.sendStatus(500);
    
    await db.clear([
        'purchase_history',
        'itens_and_categories',
        'cart',
        'itens',
        'colors',
        'categories',
        'sizes',
        'sessions',
        'users',
        'visitors',
        'genders',
    ]);

    res.sendStatus(200);
}

export {
    clearDb,
}