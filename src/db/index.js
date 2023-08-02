import knex from "knex";
import config from "../config";
const db = knex({
    client: 'mssql',
    connection: config.sqlServer
});

db.on('query', (query) => {
    console.log(`时间：${new Date().toLocaleString()}\n查询语句：${query.sql}\n查询参数：${query.bindings}`);
});
export default db;
