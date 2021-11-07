import connection from "./connection.js"
import users from "./users.js"
import genders from './genders.js';

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
        
    }


    return {
        users,
        genders,
        insertIntoTable,
        endConnection,
        clear,
    }
};
