import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';
import { getFakeUser, getValidInsertionItemsBody, getFakeHexCode } from '../src/utils/faker.js';

const db = makeDbFactory();

afterAll(() => {
    db.endConnection();
});

describe('PURCHASE-HISTORY ENTITY', () => {
    const fakeUser = getFakeUser();
    const validBody = getValidInsertionItemsBody();
    const fakeHexCode = getFakeHexCode();
    let user;
    let addedPurchase;
    let sessionToken;
    let item;
    let gender;

    beforeEach(async () => {
        await db.clear([
            'purchase_history',
            'itens_and_categories',
            'itens',
            'colors',
            'categories',
            'sizes',
            'sessions',
            'users',
            'genders',
        ]);

        gender = await db.genders.add('not_said');
        user = await db.users.add({ ...fakeUser, genderId: gender.id });
        sessionToken = await db.users.createSession(user.id);

        await db.colors.add({ colorName: validBody.colorName, hexCode: fakeHexCode });
        await db.sizes.add(validBody.sizeName);
        await db.categories.add(validBody.categories);
        item = await db.items.add({
            ...validBody,
            categories: validBody.categories.slice(0,3),
            createdAt: new Date(),
        });

        addedPurchase = await db.purchaseHistory.add({userId: user.id, itemId: item.id, quantity: 1, price: item.price })
    });

    afterAll(async () => {
        await db.clear([
            'purchase_history',
            'itens_and_categories',
            'itens',
            'colors',
            'categories',
            'sizes',
            'sessions',
            'users',
        ]);
    })

    describe('route GET /purchase-history', () => {
        test('should return 401 when invalid token', async () => {
            const result = await supertest(app)
                .get('/purchase-history')

            expect(result.status).toEqual(401);
        });

        test('should return 200 when get history', async () => {
            const result = await supertest(app)
                .get('/purchase-history')
                .set('Authorization', `Bearer ${sessionToken}`)

            const expectedObj = {
                name: item.name,
                description: item.description,
                colorName: item.colorName,
                sizeName: item.sizeName,
                image: item.imageUrl,
                quantity: 1,
                price: String(item.price.toFixed(2)),
                date: expect.anything(),
                categories: item.categories
            }

            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(1);
            expect(result.body[0]).toEqual(expect.objectContaining(expectedObj));
        });
    });
});