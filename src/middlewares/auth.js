import bcrypt from 'bcrypt'
import makeDbFactory from '../database/database.js';

const db = makeDbFactory();

async function auth(req, res, next) {
    const {
        email,
        password,
    } = req.body;

    try {
        const user = await db.users.get('byEmail', email);
        
        if (!user) {
            return res.sendStatus(401);
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.sendStatus(401);
        }

        res.locals.user = user;
    }
    catch (error) {
        res.sendStatus(500);
    }

    next();
}

export {
    auth,
}
