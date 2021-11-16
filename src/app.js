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
import { getSearchItems } from './controllers/search.js';
import { getFilters } from './controllers/filters.js';
import { addToCart, updateQty, getUserCart, deleteClientCart, removeItemFromCart } from './controllers/cart.js';
import { postCartSchema, putCartQtySchema, getClientCartSchema, deleteClientCartSchema, deleteItemFromClientCartSchema } from './schemas/cart.js';
import { getPurchaseHistory } from './controllers/purchaseHistory.js';
import { setupTestDb } from './controllers/tests.js';

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

app.get('/search/:searchedName&:categories&:colors&:sizes&:price&:orderBy', getSearchItems);
app.get('/filters', getFilters);

app.post('/cart', validateBody(postCartSchema), addToCart);
app.get('/cart', validateQuery(getClientCartSchema), getUserCart);
app.put('/cart', validateBody(putCartQtySchema), updateQty);
app.delete('/cart/item/:clientType&:token&:itemId', validateParams(deleteItemFromClientCartSchema), removeItemFromCart);
app.delete('/cart/all/:clientType&:token', validateParams(deleteClientCartSchema), deleteClientCart);

app.get('/purchase-history', validateHeaders(getAuthorizationSchema), getPurchaseHistory);

app.post('/signup', validateBody(signUpSchema), signUp);
app.post('/signin', validateBody(signInSchema), auth, signIn);
app.post('/logout', validateHeaders(getAuthorizationSchema), logOut);
app.get('/user', validateHeaders(getAuthorizationSchema), getUserAuthenticated);


// E2E test routes
app.get('/setup-test-db', setupTestDb);

export default app;
