/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';
import { randomIntFromInterval } from '../src/utils/sharedFunctions.js';
import { getInvalidCategory } from './factories/categoryFactory.js';
import { getFakeDate } from './factories/userFactory.js';
import { getRandomNumberOfFiltersAndItens } from './factories/itemsFactory.js';

const db = makeDbFactory();
const testVariables = getRandomNumberOfFiltersAndItens();
const invalidCategory = getInvalidCategory(testVariables);
const itemsWithCreatedAt = [];

describe('Search ENTITY', () => {

    beforeAll(async () => {
        await db.colors.add(testVariables.colors);
        await db.sizes.add(testVariables.sizes);
        await db.categories.add(testVariables.categories);

        await Promise.all(testVariables.items.map(item => {
            const createdAt = getFakeDate();
            itemsWithCreatedAt.push({...item, createdAt})
            return db.items.add({
                ...item,
                createdAt
            });
        }));
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

    describe('route get /filters', () => {
            
        test('should return status 200 and an object with categories, colors and sizes', async () => {
            const result = await supertest(app)
                .get('/filters')
            
            const expectedObject = {
                categories: testVariables.categories,
                colors: testVariables.colors.map( ({colorName}) => colorName),
                sizes: testVariables.sizes
            }

            expect(result.status).toEqual(200);
            expect(result.body).toEqual(expect.objectContaining(expectedObject));

        });
    });

    describe('route get /search', () => {

        test('should return status 404 if incomplete query is sent', async () => {
            const result = await supertest(app)
                .get('/search/Non&complete&Query&Sent')
            
            expect(result.status).toEqual(404);
        });

        test('should return status 401 if invalid query is sent', async () => {
            const result = await supertest(app)
                .get('/search/query&With&price&non&Number&sent')
            
            expect(result.status).toEqual(401);
        });

        test('should return status 401 if valid query is sent, but with values that are not in Database', async () => {
            const result = await supertest(app)
                .get(`/search/---&${invalidCategory}&---&---&---&---`)
            
            expect(result.status).toEqual(401);
        });


        test('if no filter is sent, should return status 200 and every Item in database', async () => {
            const result = await supertest(app)
                .get(`/search/---&---&---&---&---&---`)

            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(testVariables.items.length);
        });

        test('if VALUE is sent as filter Name, should return status 200 and every Item in database that has VALUE in its name atribute', async () => {

            const expectedName = testVariables.items[0].name;
            
            const result = await supertest(app)
                .get(`/search/${expectedName}&---&---&---&---&---`)
            
            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(testVariables.items.filter( ({name}) => name.includes(expectedName) ).length);
        });

        test('if VALUE is sent as filter category, should return status 200 and every Item in database that has VALUE in its category atribute', async () => {
            const expectedCategory = testVariables.categories[0];
            
            const result = await supertest(app)
                .get(`/search/---&${expectedCategory}&---&---&---&---`)
            
            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(testVariables.items.filter( ({categories}) => categories.find( (category) => category.includes(expectedCategory) )).length);
        });

        test('if VALUEs are sent as filter category, should return status 200 and every Item in database that has VALUES in one of its category atribute', async () => {
            const expectedCategory1 = testVariables.categories[0];
            const expectedCategory2 = testVariables.categories[testVariables.colors.length - 1];
            
            const result = await supertest(app)
                .get(`/search/---&${expectedCategory1}+${expectedCategory2}&---&---&---&---`)
            
            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(testVariables.items.filter( ({categories}) => categories.find( (category) => category.includes(expectedCategory1) || category.includes(expectedCategory2) )).length);
        });

        test('if VALUE is sent as filter color, should return status 200 and every Item in database that has VALUE in its color atribute', async () => {
            const expectedColor = testVariables.colors[0].colorName;
            
            const result = await supertest(app)
                .get(`/search/---&---&${expectedColor}&---&---&---`)
            
            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(testVariables.items.filter( ({colorName}) => colorName === expectedColor ).length);
        });

        test('if VALUEs are sent as filter color, should return status 200 and every Item in database that has either one of VALUES in its color atribute', async () => {
            const expectedColor1 = testVariables.colors[0].colorName;
            const expectedColor2 = testVariables.colors[testVariables.colors.length - 1].colorName;
            
            const result = await supertest(app)
                .get(`/search/---&---&${expectedColor1}+${expectedColor2}&---&---&---`)
            
            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(testVariables.items.filter( ({colorName}) => colorName === expectedColor1 || colorName === expectedColor2 ).length);
        });

        test('if VALUE is sent as filter size, should return status 200 and every Item in database that has VALUE in its size atribute', async () => {
            const expectedSize = testVariables.sizes[0];
            
            const result = await supertest(app)
                .get(`/search/---&---&---&${expectedSize}&---&---`)
            
            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(testVariables.items.filter( ({sizeName}) => sizeName === expectedSize ).length);
        });

        test('if VALUEs are sent as filter color, should return status 200 and every Item in database that has either one of VALUES in its color atribute', async () => {
            const expectedSize1 = testVariables.sizes[0];
            const expectedSize2 = testVariables.sizes[testVariables.sizes.length - 1];
            
            const result = await supertest(app)
                .get(`/search/---&---&---&${expectedSize1}+${expectedSize2}&---&---`)
            
            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(testVariables.items.filter( ({sizeName}) => sizeName === expectedSize1 || sizeName === expectedSize2 ).length);
        });

        test('if VALUE is sent as filter price, should return status 200 and every Item in database that has atribute price lower than VALUE', async () => {
            const randomPrice = randomIntFromInterval(3, 8)*10;
            
            const result = await supertest(app)
                .get(`/search/---&---&---&---&${randomPrice}&---`)
            
            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(testVariables.items.filter( ({price}) => Number(price) < randomPrice ).length);
        });

        test('if mais-recente is sent as filter OrderBy, should return status 200 and every Item in database , sorted by most recent first', async () => {

            function compare(a, b) {
                return b.createdAt - a.createdAt;
            }
            
            const result = await supertest(app)
                .get(`/search/---&---&---&---&---&mais-recente`)
            
            expect(result.status).toEqual(200);
            expect(new Date(result.body[0].createdAt)).toEqual(itemsWithCreatedAt.sort(compare)[0].createdAt);
            expect(new Date(result.body[result.body.length - 1].createdAt)).toEqual(itemsWithCreatedAt.sort(compare)[itemsWithCreatedAt.length - 1].createdAt);
        });

        test('if menos-recente is sent as filter OrderBy, should return status 200 and every Item in database , sorted by most recent last', async () => {

            function compare(a, b) {
                return a.createdAt - b.createdAt;
            }
            
            const result = await supertest(app)
                .get(`/search/---&---&---&---&---&menos-recente`)
            
            expect(result.status).toEqual(200);
            expect(new Date(result.body[0].createdAt)).toEqual(itemsWithCreatedAt.sort(compare)[0].createdAt);
            expect(new Date(result.body[result.body.length - 1].createdAt)).toEqual(itemsWithCreatedAt.sort(compare)[itemsWithCreatedAt.length - 1].createdAt);
        });

        test('if maior-preco is sent as filter OrderBy, should return status 200 and every Item in database , sorted by most expensive first', async () => {

            function compare(a, b) {
                return Number(b.price) - Number(a.price);
            }
            
            const result = await supertest(app)
                .get(`/search/---&---&---&---&---&maior-preco`)
            
            expect(result.status).toEqual(200);
            expect(Number(result.body[0].price)).toEqual(Number(itemsWithCreatedAt.sort(compare)[0].price));
            expect(Number(result.body[result.body.length - 1].price)).toEqual(Number(itemsWithCreatedAt.sort(compare)[itemsWithCreatedAt.length - 1].price));
        });

        test('if menor-preco is sent as filter OrderBy, should return status 200 and every Item in database , sorted by most expensive last', async () => {

            function compare(a, b) {
                return Number(a.price) - Number(b.price);
            }
            
            const result = await supertest(app)
                .get(`/search/---&---&---&---&---&menor-preco`)
            
            expect(result.status).toEqual(200);
            expect(Number(result.body[0].price)).toEqual(Number(itemsWithCreatedAt.sort(compare)[0].price));
            expect(Number(result.body[result.body.length - 1].price)).toEqual(Number(itemsWithCreatedAt.sort(compare)[itemsWithCreatedAt.length - 1].price));
        });
    });
});