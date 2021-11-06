import connection from "./connection.js"
import users from "./users.js"

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
        console.log(query)

        return connection.query(query);
    }

    function endConnection() {
        connection.end();
    }

    async function clear() {
        await connection.query('DELETE FROM cart');
        await connection.query('DELETE FROM categories');
        await connection.query('DELETE FROM colors');
        await connection.query('DELETE FROM genders');
        await connection.query('DELETE FROM itens');
        await connection.query('DELETE FROM itens_and_categories');
        await connection.query('DELETE FROM purchase_history');
        await connection.query('DELETE FROM sessions');
        await connection.query('DELETE FROM sizes');
        await connection.query('DELETE FROM users');
        await connection.query('DELETE FROM visitors');
    }


    return {
        users,
        insertIntoTable,
        endConnection,
        clear,
    }
};
