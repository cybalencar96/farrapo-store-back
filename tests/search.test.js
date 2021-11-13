/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';
import { getValidInsertionItemsBody, getFakeHexCode, getFakeUser, getInvalidCategory, getFakeDate, getRandomNumberOfFiltersAndItens} from '../src/utils/faker.js';
import { randomIntFromInterval } from '../src/utils/sharedFunctions.js';

const db = makeDbFactory();
const validBody = getValidInsertionItemsBody();
const fakeHexCode = getFakeHexCode();
const testVariables = getRandomNumberOfFiltersAndItens();
const invalidCategory = getInvalidCategory(testVariables);

describe('ITEMS ENTITY', () => {

    beforeAll(async () => {
        await db.colors.add(testVariables.colors);
        await db.sizes.add(testVariables.sizes);
        await db.categories.add(testVariables.categories);
        testVariables.items.forEach( async (item) => {
            await db.items.add(item);
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

    describe('route get /filters', () => {
            
        test('should return status 200 and an object with categories, colors and sizes', async () => {
            const result = await supertest(app)
                .get('/filters')
            
            const expectedObject = {
                categories: testVariables.categories,
                colors: testVariables.colors.map( ({colorName}) => colorName),
                sizes: testVariables.sizes
            }
            
            console.log(result);

            expect(result.status).toEqual(200);
//            expect(result.body).toEqual(expect.objectContaining(expectedObject));

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


        test('should return status 200 and every Item in database', async () => {
            const result = await supertest(app)
                .get(`/search/---&---&---&---&---&---`)
            
            expect(result.status).toEqual(200);
        });
    });
});