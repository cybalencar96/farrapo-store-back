import bcrypt from 'bcrypt';
import makeDbFactory from '../database/database.js';

const db = makeDbFactory();

async function signUp(req, res) {
    const {
        name,
        email,
        password,
        zipCode,
        streetNumber,
        complement,
        phone,
        genderName,
        birthDate,
        imageUrl,
    } = req.body;

    try {
        const user = await db.users.get('byEmail', email);
        if (user) {
            return res.status(409).send('email already exists');
        }

        const gender = await db.genders.get(genderName);
        if (!gender) {
            return res.status(400).send('invalid genderName')
        }


        const addedUser = await db.users.add({
            name,
            email,
            password,
            zipCode,
            streetNumber,
            complement,
            phone,
            genderId: gender.id,
            birthDate,
            imageUrl,
        });


        return res.status(200).send(addedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function signIn(req, res) {
    const user = res.locals.user
    
    try {
        const token = await db.users.createSession(user.id);

        return res.send({
            id: user.id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getUserAuthenticated(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('missing token');
    }

    try {
        const user = await db.users.get('session', token);
        if (!user) {
            return res.status(401).send('user not authenticated, try log in again');
        }

        return res.send({
            id: user.user_id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function logOut(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).send('missing token');
    }
    
    try {
        await db.users.removeSessions('byToken', token);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export {
    signUp,
    signIn,
    getUserAuthenticated,
    logOut,
};
