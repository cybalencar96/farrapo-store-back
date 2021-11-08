import connection from "./connection.js"
import items from "./items.js"
import users from "./users.js"
import genders from './genders.js';
import categories from "./categories.js";
import colors from "./colors.js";
import sizes from "./sizes.js";

export default function makeDbFactory() {

    async function insertIntoTable(tableName, columns, values) {
        let query = `INSERT INTO ${tableName} (`

        for (let i = 0; i < columns.length; i++) {
            query += `${columns[i]}, `
        }
        
        query = query.substr(0, query.length-2) + ' VALUES (';

        for (let i = 0; i < values.length; i++) {
            query += `${columns[i]}, `;
        }

        query = query.substr(0, query.length-2) + ';';

        return connection.query(query);
    }

    function endConnection() {
        connection.end();
    }

    async function clear() {
        await connection.query('DELETE FROM users');
        await connection.query('DELETE FROM itens_and_categories');
        await connection.query('DELETE FROM itens');
        await connection.query('DELETE FROM colors');
        await connection.query('DELETE FROM categories');
        await connection.query('DELETE FROM sizes');
    }


    return {
        items,
        users,
        genders,
        categories,
        colors,
        sizes,
        insertIntoTable,
        endConnection,
        clear,
    }
};
