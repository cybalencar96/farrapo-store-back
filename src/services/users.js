function makeUsersService(db, errorMessage, successMessage) {
    async function signUp(userInfo) {
        const {
            name,
            email,
            password,
            zipCode,
            phone,
            genderName,
            birthDate,
            imageUrl,
            streetNumber,
            complement,
        } = userInfo;

        const user = await db.users.get('byEmail', email);
        if (user) {
            return errorMessage({ text: 'email already exists' });
        }

        const gender = await db.genders.get(genderName);
        if (!gender) {
            return errorMessage({ text: 'invalid genderName' });
        }

        const addedUser = await db.users.add({
            name,
            email,
            password,
            zipCode,
            phone,
            genderId: gender.id,
            birthDate,
            imageUrl,
            streetNumber,
            complement,
        });

        return successMessage({ body: addedUser });
    }

    async function signIn({ user }) {
        const token = await db.users.createSession(user.id);

        return successMessage({ body: token });
    }

    async function getUserAuthenticated({ token }) {
        const user = await db.users.get('session', token);

        if (!user) {
            return errorMessage({ text: 'user not authenticated, try log in again' });
        }

        return successMessage({ body: user });
    }

    async function logOut({ token }) {
        const user = await db.users.get('session', token);

        if (!user) {
            return errorMessage({ text: 'user not logged in' });
        }

        await db.cart.deleteUserCart({ clientType: "user", token});
        await db.users.removeSessions('byToken', token);

        return successMessage();
    }

    async function registerVisitor({ visitorToken }) {
        await db.visitors.add(visitorToken);

        return successMessage();
    }


    return {
        signUp,
        signIn,
        getUserAuthenticated,
        logOut,
        registerVisitor,
    }
}

export {
    makeUsersService,
}