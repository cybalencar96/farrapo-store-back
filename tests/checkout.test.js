/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';
import { randomIntFromInterval } from '../src/utils/sharedFunctions.js';
import { getValidInsertionItemsBody } from '../src/factories/itemsFactory.js';
import { getFakeHexCode, getInvalidColor } from '../src/factories/colorFactory.js';
import { getInvalidSize } from '../src/factories/sizeFactory.js';
import { getInvalidCategory } from '../src/factories/categoryFactory.js';
import { getFakeUser, getFakeUuid, getValidCheckoutUserData } from '../src/factories/userFactory.js';

const db = makeDbFactory();
const validBody = getValidInsertionItemsBody();
const fakeHexCode = getFakeHexCode();
const invalidColor = getInvalidColor(validBody);
const invalidSize = getInvalidSize(validBody);
const invalidCategory = getInvalidCategory(validBody);
const fakeUser = getFakeUser();
const fakePaidPrice = randomIntFromInterval(3, 8) * 10;


describe('CheckOut ENTITY', () => {

    let fakeToken;
    let fakeCreatedItem;
    let gender;
    let cartItem;
    const validUserData = getValidCheckoutUserData();

    beforeAll(async () => {
        await db.clear([
            'purchase_history',
            'cart',
            'itens_and_categories',
            'itens',
            'colors',
            'categories',
            'sizes',
            'sessions',
            'users',
            'genders',
        ]);
        await db.colors.add([{ colorName: validBody.colorName, hexCode: fakeHexCode }]);
        await db.sizes.add([validBody.sizeName]);
        await db.categories.add(validBody.categories);
        fakeCreatedItem = await db.items.add({
            ...validBody,
            categories: validBody.categories.slice(0,3), // for better predicting which categories will be more popular from user history
            createdAt: new Date(),
        })
        gender = await db.genders.add('not_said');
        const user = await db.users.add({ ...fakeUser, genderId: gender.id });
        
        fakeToken = await db.users.createSession(user.id);
        const purchaseToken = await db.purchaseHistory.add({
            userId: user.id,
            itemId: fakeCreatedItem.id,
            quantity: randomIntFromInterval(20,100),
            price: fakePaidPrice,
            date: new Date(),
        })

        cartItem = await db.cart.addItem({
            itemId: fakeCreatedItem.id,
            userId: user.id,
            quantity: 1,
        });

        
    });

    afterAll(async () => {
        await db.clear([
            'purchase_history',
            'cart',
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

    describe('route POST /checkout', () => {
            
        test('should return 400 if body has missing atributes', async () => {
            const invalidBody = {
                cart: [],
                userData: validUserData
            };

            const result = await supertest(app)
                .post('/checkout').send(invalidBody)
                .set('Authorization', `Bearer ${fakeToken}`);

            expect(result.status).toEqual(400);
        });

        test('should return 401 if no token is sent', async () => {
            const validBody = {
                cart: [cartItem],
                userData: validUserData
            };
            const result = await supertest(app)
                .post('/checkout').send(validBody)

            expect(result.status).toEqual(401);
        });

        test('should return 400 if invalid token is sent', async () => {
            const validBody = {
                cart: [cartItem],
                userData: validUserData
            };

            const result = await supertest(app)
                .post('/checkout').send(validBody)
                .set('Authorization', `Bearer ${getFakeUuid()}`);

            expect(result.status).toEqual(400);
        });

        test('should return 400 if cart length does not match cart in database', async () => {
            const validBody = {
                cart: [cartItem, cartItem],
                userData: validUserData
            };

            const result = await supertest(app)
                .post('/checkout').send(validBody)
                .set('Authorization', `Bearer ${fakeToken}`);

            expect(result.status).toEqual(400);
        });

        test('should return 400 if cart items dont match cart in database', async () => {
            const validBody = {
                cart: [{...cartItem, cartQty: cartItem.cartQty - 1}],
                userData: validUserData
            };

            const result = await supertest(app)
                .post('/checkout').send(validBody)
                .set('Authorization', `Bearer ${fakeToken}`);

            expect(result.status).toEqual(400);
        });

        test('should return 200 and a purchase token if sent data is correct', async () => {
            const validBody = {
                cart: [cartItem],
                userData: validUserData
            };

            const result = await supertest(app)
                .post('/checkout').send(validBody)
                .set('Authorization', `Bearer ${fakeToken}`);

            expect(result.status).toEqual(200);
            expect(result.body).toEqual(expect.objectContaining({ token: expect.any(String) }))
            expect(result.body.token.length).toEqual(36);
        });
    });
});
