import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from './connection.js';

async function add(userInfo) {
    const {
        name,
        email,
        password,
        zipCode,
        streetNumber,
        complement,
        phone,
        genderId,
        birthDate,
        imageUrl,
    } = userInfo;

    const hash = bcrypt.hashSync(password, 10);
    
    await connection.query(
        `INSERT INTO users (
            name,
            email,
            password, 
            zip_code, 
            street_number,
            complement,
            phone,
            gender_id, 
            birth_date, 
            image_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [   name, 
            email, 
            hash, 
            zipCode, 
            streetNumber, 
            complement, 
            phone, 
            genderId, 
            birthDate, 
            imageUrl
        ],
    );

    const result = await connection.query(`
            SELECT 
                users.id,
                users.name,
                users.email,
                users. zip_code, 
                users.street_number,
                users.complement,
                users.phone,
                genders.name, 
                users.birth_date, 
                users.image_url
            FROM users
            JOIN genders ON users.gender_id = genders.id
            WHERE users.email = '${email}' LIMIT 1;
    `);

    return result.rows[0];
}

async function get(getType, userData) {
    if (getType === 'byEmail') {
        const result = await connection.query(
            'SELECT * FROM users WHERE email = $1',
            [userData],

        );

        return result.rows[0];
    }

    if (getType === 'byId') {
        const result = await connection.query(
            'SELECT * FROM users WHERE id = $1',
            [userData],
        );

        return result.rows[0];
    }

    if (getType === 'session') {
        const result = await connection.query(
            `SELECT user_id, users.name, users.email 
             FROM sessions 
             JOIN users 
                ON sessions.user_id = users.id 
            WHERE sessions.token = $1
            `, [userData],
        );
    
        return result.rows[0];
    }
    
    return null;
}

async function createSession(userId) {
    const token = uuid();
    
    await connection.query(
        'INSERT INTO sessions (token, user_id) VALUES ($1,$2)',
        [token, userId],
    );

    return token;
}

async function remove(removeType) {
    if (removeType === 'all') {
        await connection.query('DELETE FROM users');
    }
}

async function removeSessions(removeType, removeData) {
    if (removeType === 'all') {
        await connection.query('DELETE FROM sessions');
    }

    if (removeType === 'byToken') {
        await connection.query('DELETE FROM sessions WHERE token = $1', [removeData]);
    }
}

const usersFactory = {
    add,
    remove,
    removeSessions,
    createSession,
    get,
};

export default usersFactory;
