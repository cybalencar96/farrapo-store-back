import connection from "./connection.js"
import items from "./items.js"
import users from "./users.js"
import genders from './genders.js';
import categories from "./categories.js";
import colors from "./colors.js";
import sizes from "./sizes.js";
import purchaseHistory from "./purchase_history.js";

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

    async function getAllFilters() {
        const singleQuery = (table) => `SELECT name FROM ${table};`;
        let queryText = singleQuery("categories");
        queryText += singleQuery("colors");
        queryText += singleQuery("sizes");

        const results = await connection.query(queryText);
        return results.map(({ rows }) => rows.map( ({name}) => name));
    }

    async function clear(tables) {
        let queryText = '';
        tables.forEach(table => {
            queryText += `DELETE FROM ${table};`
        })
        await connection.query(queryText);
    }


    return {
        items,
        users,
        genders,
        categories,
        colors,
        sizes,
        purchaseHistory,
        insertIntoTable,
        endConnection,
        clear,
        getAllFilters,
    }
};
