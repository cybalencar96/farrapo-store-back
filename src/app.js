import express from 'express'
import cors from 'cors'
import {
    signUp,
    signIn,
    getUserAuthenticated,
    logOut,
} from './controllers/users.js';
import {
    getHomepageItems,
    addItems,
    getItem,
    getItems,
} from './controllers/items.js';
import { auth } from './middlewares/auth.js'
import {
    validateBody,
    validateHeaders,
    validateParams,
    validateQuery,
} from './middlewares/validateRequest.js';
import {
    signUpSchema,
    signInSchema,
    getAuthorizationSchema,
} from './schemas/users.js';
import {
    itemsSchema,
    getItemSchema,
    getItemsSchema,
} from "./schemas/items.js"
import { addToCart, updateQty, getUserCart } from './controllers/cart.js';
import { postCartSchema, putCartQtySchema, getClientCartSchema } from './schemas/cart.js';
import { getPurchaseHistory } from './controllers/purchaseHistory.js';

const app = express()
app.use(express.json());
app.use(cors());

app.get('/status', (req,res) => {
    res.sendStatus(200)
});

app.post('/items', validateBody(itemsSchema), addItems);
app.get('/items', validateQuery(getItemsSchema), getItems);
app.get('/homepage/items', getHomepageItems);
app.get('/items/:id', validateParams(getItemSchema), getItem);

app.post('/cart', validateBody(postCartSchema) ,addToCart);
app.put('/cart', validateBody(putCartQtySchema), updateQty);
app.get('/cart', validateQuery(getClientCartSchema), getUserCart);

app.get('/purchase-history', validateHeaders(getAuthorizationSchema), getPurchaseHistory);

app.post('/signup', validateBody(signUpSchema), signUp);
app.post('/signin', validateBody(signInSchema), auth, signIn);
app.post('/logout', validateHeaders(getAuthorizationSchema), logOut);
app.get('/user', validateHeaders(getAuthorizationSchema), getUserAuthenticated);

export default app;
