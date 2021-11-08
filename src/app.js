import express from 'express'
import cors from 'cors'
import {
    signUp,
    signIn,
    getUserAuthenticated,
    logOut,
} from './controllers/users.js';
import { getHomepageItems, addItems } from './controllers/items.js';
import { auth } from './middlewares/auth.js'
import {
    validateBody,
    validateHeaders,
} from './middlewares/validateRequest.js';
import {
    signUpSchema,
    signInSchema,
    getAuthorizationSchema
} from './schemas/users.js';
import {
    itemsSchema
} from "./schemas/items.js"

const app = express()
app.use(express.json());
app.use(cors());

app.get('/status', (req,res) => {
    res.sendStatus(200)
});

app.post('/signup', signUp);
app.post('/signup', validateBody(signUpSchema), signUp)
// app.get('/user', auth, validateBody(getUserSchema), getUser)

app.post('/items', validateBody(itemsSchema), addItems);
app.get('/items/homepage', getHomepageItems);

app.get('/teste', async (req, res) => {
    // const result = await connection.query(`UPDATE users SET gender_id =1;`) 
    const result = await connection.query(`SELECT * FROM genders ;`)
});
    
app.post('/signup', validateBody(signUpSchema), signUp);
app.post('/signin', validateBody(signInSchema), auth, signIn);
app.post('/logout', validateHeaders(getAuthorizationSchema), logOut);
app.get('/user', validateHeaders(getAuthorizationSchema), getUserAuthenticated);

export default app;
