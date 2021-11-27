function makeCartService(db) {
    async function addItem(cartInfos = {}) {
        const {
            userId,
            itemId,
            quantity,
            visitorToken,
        } = cartInfos;

        const item = await db.items.get({ id: itemId })
        if (!item) return errorMessage({ text: 'item not found' });

        let visitor;

        if (visitorToken) {
            visitor = await db.visitors.get(visitorToken)
            
            if (!visitor) {
                return errorMessage({ text: 'Visitor invalid' })
            }

            const itemInCart = await db.cart.get({ itemId, visitorId: visitor.id });

            if (itemInCart) return errorMessage({ text: 'item already in cart' });
        }

        if (userId) {
            user = await db.users.get(userId)
            
            if (!user) {
                return errorMessage({ text: 'user invalid' })
            }

            const itemInCart = await db.cart.get({ itemId, userId });
            if (itemInCart) return errorMessage({text: 'item already in cart'});
        }

        const itemInCart = await db.cart.getItemQtyInCart(itemId);
        if (itemInCart && itemInCart.qtyInCart >= itemInCart.maxQty) {
            return errorMessage({text: 'max dynamic quantity reached'});
        }

        let addedItem;

        if (userId) addedItem = await db.cart.addItem({ itemId, quantity, userId });
        if (visitorToken) addedItem = await db.cart.addItem({ itemId, quantity, visitorId: visitor.id });
        

        return successMessage({body: addedItem});
    }

    async function updateItemQty({ clientType, token, itemId, quantity }) {
        let requiredItem;
        const item = await db.items.get({id: itemId});
        if (!item) return errorMessage({text: 'item not found or quantity limit surpassed'});

        if (clientType === 'visitor') {
            const visitor = await db.visitors.get(token);
            requiredItem = await db.cart.get({ itemId, visitorId: visitor.id });
        }

        if (clientType === 'user') {
            const user = await db.users.get('session', token);
            requiredItem = await db.cart.get({ itemId, userId: user.user_id });
        }

        
        if (!requiredItem || quantity > item.quantity) {

            return errorMessage({text: 'item not found or quantity limit surpassed'});
        }

        const updatedItem = await db.cart.updateItemQty({ clientType, token, itemId, quantity });
        return successMessage({ body: updatedItem });
    }

    async function getUserCart({userId, visitorToken}) {
        let visitor = {};
        if (visitorToken) {
            visitor = await db.visitors.get(visitorToken);
            if (!visitor) return errorMessage({ text: 'visitorToken invalid' });
        }

        if (userId) {
            const user = await db.users.get('byId', userId);
            if (!user) return errorMessage({ text: 'user invalid' });
        }

        const userCart = await db.cart.getCartFromUser({userId, visitorId: visitor.id});
        return successMessage({ body: userCart });
    }

    async function removeItemFromCart({clientType, token, itemId}) {
        const deletedItem = await db.cart.deleteItemFromUserCart({clientType, token, itemId});
        
        if (!deletedItem) {
            return errorMessage({text: 'item not deleted'});
        }

        return successMessage({body: deletedItem});
    }

    async function deleteUserCart({ clientType, token }) {
        const deletedCart = await db.cart.deleteUserCart({ clientType, token });
        
        if (!deletedCart) {
            return errorMessage({text: 'cart not deleted'});
        }

        return successMessage({ body: deletedCart })
    }

    async function transferCartVisitantToUser({ userId, visitorToken }) {
        const visitor = await db.visitors.get(visitorToken);
        if (!visitor) {
            return errorMessage({ text: 'invalid visitorId' });
        }

        await db.cart.transferItems({ userId, visitorId: visitor.id });
        await db.visitors.remove(visitorToken);

        return successMessage();
    }

    return {
        addItem,
        updateItemQty,
        getUserCart,
        removeItemFromCart,
        deleteUserCart,
        transferCartVisitantToUser,
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
    makeCartService,
}