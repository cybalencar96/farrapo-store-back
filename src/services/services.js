import { makeCartService } from './cart.js';
import makeDbFactory from '../database/database.js';

const db = makeDbFactory();

function makeServices() {
    const cart = makeCartService(db);
    
    
    return {
        cart: cart,
    }
}

export {
    makeServices
}