import makeDbFactory from '../database/database.js';
import { makeCartService } from './cart.js';
import { makeCheckoutService } from './checkout.js';
import { makeFiltersService } from './filters.js';
import { makeItemsService } from './items.js';
import { makePurchaseHistoryService } from './purchaseHistory.js';
import { makeSearchService } from './search.js';
import { makeUsersService } from './users.js';

const db = makeDbFactory();

function makeServices() {
    
    const cart = makeCartService(db, errorMessage, successMessage);
    const checkout = makeCheckoutService(db, errorMessage, successMessage);
    const filters = makeFiltersService(db, errorMessage, successMessage);
    const items = makeItemsService(db, errorMessage, successMessage);
    const purchaseHistory = makePurchaseHistoryService(db, errorMessage, successMessage);
    const search = makeSearchService(db, errorMessage, successMessage);
    const users = makeUsersService(db, errorMessage, successMessage);

    return {
        cart,
        checkout,
        filters,
        items,
        purchaseHistory,
        search,
        users,
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

function successMessage(infos = {}) {
    const {
        body,
    } = infos;

    return {
        error: null,
        body: body || true,
    }
}

export {
    makeServices,
}