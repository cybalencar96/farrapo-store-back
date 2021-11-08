import express from 'express'
import cors from 'cors'
import {
    signUp
} from './controllers/users.js';
import { getHomepageItems, addItems } from './controllers/items.js';
import { auth } from './middlewares/auth.js'
import { validateBody } from './middlewares/validateBody.js';
import {
    signUpSchema,
    //getUserSchema,
} from './schemas/users.js';
import {
    itemsSchema
} from "./schemas/items.js"

import connection from './database/connection.js';

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

app.get('/teste', async (req,res) => {
    // const result = await connection.query(`UPDATE users SET gender_id =1;`) 
    const result = await connection.query(`SELECT * FROM genders ;`) 
     
    

    res.send(result.rows)
})
export default app;