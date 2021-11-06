import connection from "./connection.js"
import users from "./users.js"

export default function makeDbFactory() {

    function clear() {

    }

    return {
        users,
    }
};
