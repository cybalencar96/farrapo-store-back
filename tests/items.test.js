/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';
import { getValidInsertionItemsBody, getFakeHexCode, getInvalidColor, getInvalidSize, getInvalidCategory, getFakeUser, getFakeUuid} from '../src/utils/faker.js';
import { randomIntFromInterval } from '../src/utils/sharedFunctions.js';

const db = makeDbFactory();
const validBody = getValidInsertionItemsBody();
const fakeHexCode = getFakeHexCode();
const invalidColor = getInvalidColor(validBody);
const invalidSize = getInvalidSize(validBody);
const invalidCategory = getInvalidCategory(validBody);
const fakeUser = getFakeUser();
const fakePaidPrice = randomIntFromInterval(3, 8) * 10;


describe('ITEMS ENTITY', () => {

    let fakeToken;
    let fakeCreatedItem;

    beforeAll(async () => {
        await db.colors.add({ colorName: validBody.colorName, hexCode: fakeHexCode });
        await db.sizes.add(validBody.sizeName);
        await db.categories.add(validBody.categories);
        await db.items.add({
            ...validBody,
            createdAt: new Date(),
        })
        fakeCreatedItem = await db.items.add({
            ...validBody,
            categories: validBody.categories.slice(0,3),
            createdAt: new Date(),
        }) // for better predict which categories will be more popular from user history - Test Number 7;
        const user = await db.users.add(fakeUser);
        fakeToken = await db.users.createSession(user.id);
        await db.purchaseHistory.add({
            userId: user.id,
            itemId: fakeCreatedItem.id,
            quantity: randomIntFromInterval(2,100),
            price: fakePaidPrice,
            date: new Date(),
        })
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
        db.endConnection();
    });

    describe('route POST /items', () => {
            
        test('Number 1: should return 400 if body has missing atributes', async () => {
            const invalidBody = { ...validBody, categories: [] };
            const result = await supertest(app)
                .post('/items').send(invalidBody);

            expect(result.status).toEqual(400);
        });

        test('Number 2: should return 404 if body.colorName is not in Database', async () => {
            const bodyWithInvalidColor = { ...validBody, colorName: invalidColor };
            const result = await supertest(app)
                .post('/items').send(bodyWithInvalidColor);

            expect(result.status).toEqual(404);
        });

        test('Number 3: should return 404 if body.sizeName is not in Database', async () => {
            const bodyWithInvalidSize = { ...validBody, sizeName: invalidSize };
            const result = await supertest(app)
                .post('/items').send(bodyWithInvalidSize);

            expect(result.status).toEqual(404);
        });

        test('Number 4: should return 404 if body.categories includes any category that is not in Database', async () => {
            const bodyWithInvalidCategory = { ...validBody, categories: [...validBody.categories, invalidCategory] };
            const result = await supertest(app)
                .post('/items').send(bodyWithInvalidCategory);

            expect(result.status).toEqual(404);
        });

        test('Number 5: should return 201 if body is valid', async () => {
            const result = await supertest(app)
                .post('/items').send(validBody);

            expect(result.status).toEqual(201);
        });
    });


    describe('route GET /items/homepage', () => {

        test('Number 6: If no token is sent, should return 200 and an array of 5 random objects', async () => {
            const result = await supertest(app)
                .get('/items/homepage');

            expect(result.status).toEqual(200);
            expect(result.body).toHaveLength(5);
            result.body.forEach(menuObject => {
                expect(menuObject).toEqual(
                    expect.objectContaining({
                        title:expect.any(String),
                        forwardMessage:expect.any(String),
                        itens:expect.any(Array),
                    })
                )
            })
        });

        test(`Number 7: If token is sent, should return 200 and an array of 5 objects, but titles must match data from user's purchase History`, async () => {
            
            const expectedResult = [
                { title: `Até R$${fakePaidPrice},00`, forwardMessage: "Que pechincha!", itens: expect.any(Array) },
                { title: `Que tal um pouco de ${fakeCreatedItem.colorName.toLowerCase()}`, forwardMessage: "Quero ver mais!", itens: expect.any(Array) },
                { title: fakeCreatedItem.categories[0], forwardMessage: "Quero ver mais!", itens: expect.any(Array) },
                { title: fakeCreatedItem.categories[1], forwardMessage: "Quero ver mais!", itens: expect.any(Array) },
                { title: fakeCreatedItem.categories[2], forwardMessage: "Quero ver mais!", itens: expect.any(Array) },
            ];

            const result = await supertest(app)
                .get('/items/homepage').set('Authorization', `Bearer ${fakeToken}`);

            expect(result.status).toEqual(200);
            expect(result.body).toEqual(expect.arrayContaining(expectedResult));
        });
    });
});