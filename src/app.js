import express from 'express'
import cors from 'cors'
import {
    signUp
} from './controllers/users.js';
import { getItems, addItems } from './controllers/homepage.js';

const app = express()
app.use(express.json());
app.use(cors());

app.get('/status', (req,res) => {
    res.sendStatus(200)
});

app.post('/signup', signUp);

app.get('/items', getItems)
app.post('/items', addItems);

export default app;