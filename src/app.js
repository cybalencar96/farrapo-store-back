import express from 'express'
import cors from 'cors'
import {
    signUp
} from './controllers/users.js';

import connection from './database/connection.js';

const app = express()
app.use(express.json());
app.use(cors());

app.get('/status', (req,res) => {
    res.sendStatus(200)
});

app.post('/signup', signUp)
app.get('/', async (req,res) => {
    const result = await connection.query('SELECT * FROM categories')
    res.send(result.rows)
})

export default app;