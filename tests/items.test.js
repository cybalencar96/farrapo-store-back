/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';

const db = makeDbFactory();

afterAll(async () => {
    await db.clear();
    db.endConnection();
});

describe('ITEMS ENTITY', () => {



    describe('route GET /items', () => {

        test('should return 400 when body is not valid', () => {
            const result = await supertest(app)
                .post('/items')
                .send();

            expect(result.status).toEqual(400);
        });
    });
});