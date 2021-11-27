function makeCheckoutService(db, errorMessage, successMessage) {
    async function transferFromCartToHistory({ cart, token }) {
        const userId = (await db.users.get("session", token))?.user_id;

        if (!userId) {
            return errorMessage({text: 'session not found'})
        }

        const savedCart = await db.cart.getCartFromUser({ userId });

        if (cart.length !== savedCart.length) {
            return errorMessage({text: 'something went wrong with cart'});
        }

        for (let i = 0; i < cart.length; i++) {
            const receivedItem = cart[i];
            const savedItem = savedCart.find(({ itemId }) => itemId === receivedItem.itemId);
            if (!savedItem || !areItemObjectsEqual(receivedItem, savedItem)) {
                return errorMessage({text: 'something went wrong with cart'});
            }
        }

        const purchaseToken = await db.purchaseHistory.addSeveral(userId, cart);
        await db.cart.deleteUserCart({clientType: "user", token: res.locals.token});
        await db.items.updateQuantity(cart);

        return successMessage({body: purchaseToken});
    }

    return {
        transferFromCartToHistory,
    }
}

function areItemObjectsEqual(receivedItem, savedItem) {
    const atributesToCompare = ["itemId", "cartQty", "price", "maxQty"];
    let areItemsEqual = true;
    for (let i = 0; i < atributesToCompare.length; i++) {
        const atribute = atributesToCompare[i];
        if (receivedItem[atribute] !== savedItem[atribute]) {
            areItemsEqual = false;
            break
        }
    }
    return areItemsEqual;
}

export {
    makeCheckoutService,
}