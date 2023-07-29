import knex from "knex";
import config from "../config";
const db = knex({
    client: 'mssql',
    connection: config.sqlServer
});
export default db;
