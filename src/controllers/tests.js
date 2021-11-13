import makeDbFactory from "../database/database.js";

const db = makeDbFactory();

async function setupTestDb(req, res) {
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

    await db.colors.add({ colorName: 'Branco', hexCode: 'FFFFFF' });
    await db.sizes.add('G');
    await db.categories.add(['praia', 'funeral']);
    await db.genders.add('not_said');

    res.sendStatus(200);
}

export {
    setupTestDb,
}