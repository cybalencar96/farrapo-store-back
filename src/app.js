import express from 'express'
import cors from 'cors'
import {
    signUp,
    signIn,
    getUserAuthenticated
} from './controllers/users.js';
import { auth } from './middlewares/auth.js'
import {
    validateBody,
    validateHeaders,
} from './middlewares/validateRequest.js';
import {
    signUpSchema,
    signInSchema,
    getUserSchema,
} from './schemas/users.js';

import connection from './database/connection.js';

const app = express()
app.use(express.json());
app.use(cors());

app.get('/status', (req,res) => {
    res.sendStatus(200)
});

app.post('/signup', validateBody(signUpSchema), signUp)
app.post('/signin', validateBody(signInSchema), auth, signIn)
app.get('/user', validateHeaders(getUserSchema), getUserAuthenticated)


app.get('/teste', async (req,res) => {
    // const result = await connection.query(`UPDATE users SET gender_id =1;`) 
    const result = await connection.query(`SELECT * FROM genders ;`) 
     
    

    res.send(result.rows)
})
export default app;