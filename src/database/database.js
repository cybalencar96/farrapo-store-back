import connection from "./connection.js"
import items from "./items.js"

export default function makeDbFactory() {

    function clear() {

    }

    return {
        items,
    }
};
