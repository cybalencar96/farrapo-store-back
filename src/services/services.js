import makeDbFactory from '../database/database.js';
import { makeCartService } from './cart.js';
import { makeCheckoutService } from './checkout.js';
import { makeFiltersService } from './filters.js';
import { makeItemsService } from './items.js';

const db = makeDbFactory();

function makeServices() {
    
    const cart = makeCartService(db, errorMessage, successMessage);
    const checkout = makeCheckoutService(db, errorMessage, successMessage);
    const filters = makeFiltersService(db, errorMessage, successMessage);
    const items = makeItemsService(db, errorMessage, successMessage);
    
    return {
        cart,
        checkout,
        filters,
        items,
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
    makeServices,
}