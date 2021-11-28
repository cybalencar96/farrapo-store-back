import bcrypt from 'bcrypt';
import makeDbFactory from '../database/database.js';
import { makeServices } from '../services/services.js';

const db = makeDbFactory();
const services = makeServices();

async function signUp(req, res) {
    try {
        const { body, error } = await services.users.signUp({ ...req.body })

        if (error) {
            return res.status(400).send(error.text);
        }

        const structuredUser = {
            id: body.id,
            name: body.name,
            email: body.email,
            zipCode: body.zip_code,
            streetNumber: body.street_number,
            complement: body.complement,
            phone: body.phone,
            genderName: body.gender_name,
            birthDate: body.birth_date,
            imageUrl: body.image_url,
        }

        return res.send(structuredUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function signIn(req, res) {
    const user = res.locals.user;

    try {
        const { body } = await services.users.signIn({ user });

        return res.send({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image_url,
            token: body,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getUserAuthenticated(req, res) {
    const token = res.locals.token

    try {
        const { body, error } = await services.users.getUserAuthenticated({ token });

        if (error) {
            return res.status(401).send(error.text);
        }
        
        return res.send({
            id: body.user_id,
            name: body.name,
            email: body.email,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function logOut(req, res) {
    const token = res.locals.token

    try {
        await services.users.logOut({ token });
        
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function registerVisitor(req, res) {
    try {
        await db.visitors.add(req.body.visitorToken);
        res.send();
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
    registerVisitor,
};
