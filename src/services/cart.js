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

            const itemInCart = await db.cart.get({ itemId, visitorToken }); // quando refatorar cart get, alterar para visitorId: visitor.id

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
        

        return successMessage({item: addedItem});
    }

    return {
        addItem,
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

function successMessage({ item }) {
    return {
        error: null,
        item,
    }
}

export {
    makeCartService
}