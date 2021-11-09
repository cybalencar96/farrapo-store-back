/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';
import { getValidInsertionItemsBody, getFakeHexCode, getInvalidColor, getInvalidSize, getInvalidCategory} from '../src/utils/faker.js';

const db = makeDbFactory();
const validBody = getValidInsertionItemsBody();
const fakeHexCode = getFakeHexCode();
const invalidColor = getInvalidColor(validBody);
const invalidSize = getInvalidSize(validBody);
const invalidCategory = getInvalidCategory(validBody);

async function addFakeCategories(fakeCategories) {
    for (let i = 0; i < fakeCategories.length; i++) {
        const category = fakeCategories[i];
        await db.categories.add(category);
    }
    return;
}

describe('ITEMS ENTITY', () => {

    beforeAll(async () => {
        await db.colors.add({ colorName: validBody.colorName, hexCode: fakeHexCode });
        await db.sizes.add(validBody.sizeName);
        await addFakeCategories(validBody.categories);
        await db.items.add({
            ...validBody,
            createdAt: new Date(),
            price: 29.9
        })
    });

    afterAll(async () => {
        await db.clear([
            'itens_and_categories',
            'itens',
            'colors',
            'categories',
            'sizes'
        ]);
        db.endConnection();
    });

    describe('route POST /items', () => {
            
        test('should return 400 if body has missing atributes', async () => {
            const invalidBody = { ...validBody, categories: [] };
            const result = await supertest(app)
                .post('/items').send(invalidBody);

            expect(result.status).toEqual(400);
        });

        test('should return 404 if body.colorName is not in Database', async () => {
            const bodyWithInvalidColor = { ...validBody, colorName: invalidColor };
            const result = await supertest(app)
                .post('/items').send(bodyWithInvalidColor);

            expect(result.status).toEqual(404);
        });

        test('should return 404 if body.sizeName is not in Database', async () => {
            const bodyWithInvalidSize = { ...validBody, sizeName: invalidSize };
            const result = await supertest(app)
                .post('/items').send(bodyWithInvalidSize);

            expect(result.status).toEqual(404);
        });

        test('should return 404 if body.categories includes any category that is not in Database', async () => {
            const bodyWithInvalidCategory = { ...validBody, categories: [...validBody.categories, invalidCategory] };
            const result = await supertest(app)
                .post('/items').send(bodyWithInvalidCategory);

            expect(result.status).toEqual(404);
        });

        test('should return 201 if body is valid', async () => {
            const result = await supertest(app)
                .post('/items').send(validBody);

            expect(result.status).toEqual(201);
        });
    });


    describe('route GET /items/homepage', () => {

        test('should return 200 and an array of 5 objects', async () => {
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
    });
});