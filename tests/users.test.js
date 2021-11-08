/* eslint-disable no-undef */
import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import makeDbFactory from '../src/database/database.js';
import {
    getFakeUser,
    getInvalidFakeUser,
} from '../src/utils/faker.js';

const db = makeDbFactory();

const fakeUser = getFakeUser();
const fakeUser2 = getFakeUser();
const invalidFakeUser = getInvalidFakeUser();

afterAll(async () => {
    await db.clear();
    db.endConnection();
});

describe('USERS ENTITY', () => {
    let user;

    beforeEach(async () => {
        await db.clear();
        user = await db.users.add(fakeUser2);
    });

    describe('route POST /signup', () => {
        test('should return 400 when invalid body', async () => {
            const result = await supertest(app)
                .post('/signup')
                .send(invalidFakeUser);

            expect(result.status).toEqual(400);
        });

        test('should return 409 when email exists', async () => {
            const result = await supertest(app)
                .post('/signup')
                .send(fakeUser2);

            expect(result.status).toEqual(409);
        });

        test('should return 200 when user inserted', async () => {
            const result = await supertest(app)
                .post('/signup')
                .send(fakeUser);

            expect(result.status).toEqual(200);
        });
    });

    // describe('route POST sign-in', () => {
    //     test('should return 200 and token when user logged in', async () => {
    //         const result = await supertest(app)
    //             .post('/sign-in')
    //             .send({
    //                 email: validUser2.email,
    //                 password: validUser2.password,
    //             });

    //         expect(result.status).toEqual(200);
    //         expect(result.body.token?.length).toEqual(36);
    //     });
    // });

    // describe('route GET /user', () => {
    //     test('should return 401 when not token', async () => {
    //         const result = await supertest(app).get('/user');
    //         expect(result.status).toEqual(401);
    //         expect(result.text).toEqual('missing token');
    //     });

    //     test('should return 401 when token not valid', async () => {
    //         const fakeUUID = faker.datatype.uuid();

    //         const result = await supertest(app)
    //             .get('/user')
    //             .set('Authorization', `Bearer ${fakeUUID}`);

    //         expect(result.status).toEqual(401);
    //         expect(result.text).toEqual('user not authenticated, try log in again');
    //     });

    //     test('should return 200 and userInfo token valid', async () => {
    //         const result = await supertest(app)
    //             .get('/user')
    //             .set('Authorization', `Bearer ${token}`);

    //         const userInfo = {
    //             id: user.id,
    //             name: validUser2.name,
    //             email: validUser2.email,
    //         };

    //         expect(result.status).toEqual(200);
    //         expect(result.body).toEqual(expect.objectContaining(userInfo));
    //     });
    // });

    // describe('route POST /log-out', () => {
    //     // TODO logout tests
    // });
});
