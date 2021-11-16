import express from 'express'
import cors from 'cors'
import {
    signUp,
    signIn,
    getUserAuthenticated,
    logOut,
    registerVisitor,
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
    validateHeadersAndBody,
    validateParams,
    validateQuery,
} from './middlewares/validateRequest.js';
import {
    signUpSchema,
    signInSchema,
    getAuthorizationSchema,
    registerVisitorSchema,
} from './schemas/users.js';
import {
    itemsSchema,
    getItemSchema,
    getItemsSchema,
} from "./schemas/items.js"
import { getSearchItems } from './controllers/search.js';
import { getFilters } from './controllers/filters.js';
import { addToCart, updateQty, getUserCart, deleteClientCart, removeItemFromCart, transferCartVisitantToUser } from './controllers/cart.js';
import { postCartSchema, putCartQtySchema, getClientCartSchema, deleteClientCartSchema, deleteItemFromClientCartSchema, putCartTransferSchema } from './schemas/cart.js';
import { getHistoryByPurchaseToken, getPurchaseHistory } from './controllers/purchaseHistory.js';
import { setupTestDb } from './controllers/tests.js';
import { transferFromCartToHistory } from './controllers/checkout.js';
import { checkoutAuthorizationSchema, checkoutSchema } from './schemas/checkout.js';

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
app.put('/cart/transfer', validateBody(putCartTransferSchema), transferCartVisitantToUser);

app.delete('/cart/item/:clientType&:token&:itemId', validateParams(deleteItemFromClientCartSchema), removeItemFromCart);
app.delete('/cart/all/:clientType&:token', validateParams(deleteClientCartSchema), deleteClientCart);

app.get('/purchase-history', validateHeaders(getAuthorizationSchema), getPurchaseHistory);
app.get('/purchase-history/token', validateHeaders(getAuthorizationSchema), getHistoryByPurchaseToken);

app.post('/checkout', validateHeadersAndBody(checkoutAuthorizationSchema, checkoutSchema), transferFromCartToHistory);

app.post('/signup', validateBody(signUpSchema), signUp);
app.post('/signin', validateBody(signInSchema), auth, signIn);
app.post('/logout', validateHeaders(getAuthorizationSchema), logOut);
app.get('/user', validateHeaders(getAuthorizationSchema), getUserAuthenticated);
app.post('/visitor', validateBody(registerVisitorSchema), registerVisitor)

// E2E test routes
app.get('/setup-test-db', setupTestDb);

export default app;
