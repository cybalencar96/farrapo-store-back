import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import faker from 'faker';
import makeDbFactory from '../src/database/database.js';
import { getValidInsertionItemsBody, getFakeHexCode } from '../src/utils/faker.js';
const db = makeDbFactory();

beforeAll(() => {
    jest.setTimeout(20 * 1000);
});

afterAll(() => {
    jest.setTimeout(5 * 1000);
    db.endConnection();
});

describe('ENTITY CART', () => {
    const invalidVisitorToken = faker.datatype.uuid();
    const validVisitorToken = faker.datatype.uuid();
    const validBody = getValidInsertionItemsBody();
    const validBody2 = getValidInsertionItemsBody();
    const fakeHexCode = getFakeHexCode();
    let fakeCreatedItem;
    let fakeCreatedItem2;
    let visitor;
    let cartItem;

    beforeEach(async () => {
        
        await db.colors.add([{ colorName: validBody.colorName, hexCode: fakeHexCode }]);
        await db.sizes.add([validBody.sizeName]);
        await db.categories.add(validBody.categories);
        
        visitor = await db.visitors.add(validVisitorToken);
        fakeCreatedItem = await db.items.add({
            ...validBody,
            quantity: validBody.quantity + 1,
            categories: validBody.categories.slice(0,3), // for better predicting which categories will be more popular from user history
            createdAt: new Date(),
        });

        fakeCreatedItem2 = await db.items.add({
            ...validBody2,
            colorName: validBody.colorName,
            sizeName: validBody.sizeName,
            categories: validBody.categories.slice(0,3), // for better predicting which categories will be more popular from user history
            createdAt: new Date(),
        });

        cartItem = await db.cart.addItem({
            itemId: fakeCreatedItem.id,
            visitorId: visitor.id,
            quantity: 1,
        });
    });

    afterEach(async () => {
        await db.clear([
            'cart',
            'itens_and_categories',
            'itens',
            'colors',
            'categories',
            'sizes',
            'sessions',
            'users',
            'visitors',
        ]);
    });

    describe('route GET /cart', () => {

        test('should return 400 when sending visitor and user id', async () => {
            const result = await supertest(app)
                .get(`/cart?userId=1&visitorToken=${invalidVisitorToken}`)      

            expect(result.status).toEqual(400);
            expect(result.text).toEqual('send one id');
        });

        test('should return 400 when not sending client', async () => {
            const result = await supertest(app)
                .get(`/cart`)      

            expect(result.status).toEqual(400);
            expect(result.text).toEqual('send one id');
        });

        test('should return 400 when user invalid', async () => {
            const result = await supertest(app)
                .get('/cart?userId=1')      

            expect(result.status).toEqual(400);
            expect(result.text).toEqual('user invalid');
        });

        test('should return 400 when visitor invalid', async () => {
            const result = await supertest(app)
                .get(`/cart?visitorToken=${invalidVisitorToken}`);     

            expect(result.status).toEqual(400);
            expect(result.text).toEqual('visitorToken invalid');
        });

        test('should return 200 when get cart', async () => {
            const result = await supertest(app)
                .get(`/cart?visitorToken=${validVisitorToken}`)
                
            const expectedObj = {
                itemName: fakeCreatedItem.name,
                cartQty: 1,
                maxQty: fakeCreatedItem.quantity,
                price: String(fakeCreatedItem.price.toFixed(2)),
                imageUrl: fakeCreatedItem.imageUrl,
                description: fakeCreatedItem.description,
                size: fakeCreatedItem.sizeName,
                id: expect.anything(),
                visitorId: visitor.id,
                itemId: fakeCreatedItem.id,
                userId: null,
                userName: null
            }

            expect(result.status).toEqual(200);
            expect(result.body.length).toEqual(1);
            expect(result.body[0]).toEqual(expect.objectContaining(expectedObj));
        });
    });

    describe('route POST /cart', () => {
        test('should returns 400 when invalid body', async () => {
            const result = await supertest(app)
                .post('/cart')
                
            expect(result.status).toEqual(400);
        });

        test('should returns 400 when send both visitor and user', async () => {
            const body = {
                itemId: fakeCreatedItem2.id,
                visitorToken: validVisitorToken,
                userId: 1,
                quantity: 1,
            }

            const result = await supertest(app)
                .post('/cart')
                .send(body);
            
            expect(result.status).toEqual(400);
            expect(result.text).toEqual('send one id');
        });

        test('should returns 400 when send none visitor or user', async () => {
            const body = {
                itemId: fakeCreatedItem2.id,
                quantity: 1,
            }

            const result = await supertest(app)
                .post('/cart')
                .send(body);
            
            expect(result.status).toEqual(400);
            expect(result.text).toEqual('send one id');
        });

        test('should returns 400 when item is already in cart', async () => {
            const body = {
                itemId: fakeCreatedItem.id,
                visitorToken: validVisitorToken,
                quantity: 1,
            }

            const result = await supertest(app)
                .post('/cart')
                .send(body);
            
            expect(result.status).toEqual(400);
            expect(result.text).toEqual('item already in cart');
        });

        test('should return 200 when item inserted in cart', async () => {
            const body = {
                itemId: fakeCreatedItem2.id,
                visitorToken: validVisitorToken,
                quantity: 1,
            }

            const expectedObj = {
                itemName: fakeCreatedItem2.name,
                cartQty: 1,
                maxQty: fakeCreatedItem2.quantity,
                price: String(fakeCreatedItem2.price.toFixed(2)),
                imageUrl: fakeCreatedItem2.imageUrl,
                description: fakeCreatedItem2.description,
                size: fakeCreatedItem2.sizeName,
                id: expect.anything(),
                visitorId: visitor.id,
                itemId: fakeCreatedItem2.id,
                userId: null,
                userName: null
            }

            const result = await supertest(app)
                .post('/cart')
                .send(body);

            expect(result.status).toEqual(200);
            expect(result.body).toEqual(expect.objectContaining(expectedObj))
        });
    });

    describe('route PUT /cart', () => {
        test('should return 400 when invalid body is sent', async () => {
            const body = {
                clientType: "user",
                token: "INVALIDTOKEN",
                itemId: 3,
                quantity: 2
            }

            const result = await supertest(app)
                .put('/cart')
                .send(body)

            expect(result.status).toEqual(400)
        });

        test('should return 401 when clientType is neither User or Visitor', async () => {
            const body = {
                clientType: "INVALID",
                token: validVisitorToken,
                itemId: 3,
                quantity: 2
            }

            const result = await supertest(app)
                .put('/cart')
                .send(body)

            expect(result.status).toEqual(401)
        });

        test('should return 400 when updated Quantity is higher than available quantity', async () => {
            const body = {
                clientType: "visitor",
                token: validVisitorToken,
                itemId: fakeCreatedItem.id,
                quantity: fakeCreatedItem.quantity + 1,
            }

            const result = await supertest(app)
                .put('/cart')
                .send(body)

            expect(result.status).toEqual(400)
            expect(result.text).toEqual('item not found or quantity limit surpassed')
        });

        test('should return 400 when item is not found in users cart', async () => {
            const body = {
                clientType: "visitor",
                token: validVisitorToken,
                itemId: fakeCreatedItem2.id,
                quantity: fakeCreatedItem2.quantity,
            }

            const result = await supertest(app)
                .put('/cart')
                .send(body)

            expect(result.status).toEqual(400)
        });

        test('should return 200 and updated Item when item is updated properly', async () => {
            const body = {
                clientType: "visitor",
                token: validVisitorToken,
                itemId: fakeCreatedItem.id,
                quantity: fakeCreatedItem.quantity,
            }

            const expectedBody = {
                id: expect.anything(),
                user_id: null,
                item_id: fakeCreatedItem.id,
                quantity: fakeCreatedItem.quantity,
                visitor_id: visitor.id
            }

            const result = await supertest(app)
                .put('/cart')
                .send(body)

            expect(result.status).toEqual(200);
            expect(result.body).toEqual(expect.objectContaining(expectedBody));
        });
    });

    describe('route DELETE /cart/item', () => {
        test('should return 400 when invalid body is sent', async () => {

            const result = await supertest(app)
                .delete(`/cart/item/InvalidclientType&${validVisitorToken}&${fakeCreatedItem.id}`)

            expect(result.status).toEqual(400)
        });

        test('should return 401 when clientType is neither User or Visitor', async () => {

            const result = await supertest(app)
                .delete(`/cart/item/client&${validVisitorToken}&${fakeCreatedItem.id}`)

            expect(result.status).toEqual(401)
        });

        test('should return 404 when asked Item is not in users cart', async () => {

            const result = await supertest(app)
                .delete(`/cart/item/visitor&${validVisitorToken}&${fakeCreatedItem2.id}`)

            expect(result.status).toEqual(400)
        });

        test('should return 404 when asked user does not have a cart', async () => {

            const result = await supertest(app)
                .delete(`/cart/item/visitor&${invalidVisitorToken}&${fakeCreatedItem.id}`)

            expect(result.status).toEqual(400)
        });

        test('should return 200 and deleted Item when item is deleted properly', async () => {

            const expectedBody = {
                id: expect.anything(),
                user_id: null,
                item_id: fakeCreatedItem.id,
                quantity: 1, //Value added to the cart
                visitor_id: visitor.id
            }

            const result = await supertest(app)
                .delete(`/cart/item/visitor&${validVisitorToken}&${fakeCreatedItem.id}`)
            
            expect(result.status).toEqual(200);
            expect(result.body).toEqual(expect.objectContaining(expectedBody));
        });
    });

    describe('route DELETE /cart/all', () => {
        test('should return 400 when invalid body is sent', async () => {

            const result = await supertest(app)
                .delete(`/cart/all/InvalidclientType&${validVisitorToken}`)

            expect(result.status).toEqual(400)
        });

        test('should return 401 when clientType is neither User or Visitor', async () => {

            const result = await supertest(app)
                .delete(`/cart/all/client&${validVisitorToken}`)

            expect(result.status).toEqual(401)
        });

        test('should return 404 when asked user does not have a cart', async () => {

            const result = await supertest(app)
                .delete(`/cart/all/visitor&${invalidVisitorToken}`)

            expect(result.status).toEqual(400)
        });

        test('should return 200 and deleted Item when item is deleted properly', async () => {

            const result = await supertest(app)
                .delete(`/cart/all/visitor&${validVisitorToken}`)
            
            expect(result.status).toEqual(200);
        });
    });
});