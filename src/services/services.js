import { makeCartService } from './cart.js';
import makeDbFactory from '../database/database.js';
import { makeCheckoutService } from './checkout.js';

const db = makeDbFactory();

function makeServices() {
    
    const cart = makeCartService(db, errorMessage, successMessage);
    const checkout = makeCheckoutService(db, errorMessage, successMessage);
    
    
    return {
        cart,
        checkout,
    }
}


function errorMessage({ text }) {
    return {
        error: {
            text: text,

        },
        item: null,
    }
}

function successMessage({ body }) {
    return {
        error: null,
        body: body || true,
    }
}

export {
    makeServices
}