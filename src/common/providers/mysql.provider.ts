
export const mysqlProvider = [{
    provide: 'MYSQL_CONNECTION',
    useFactory: async () => {
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '12052005',
            database: 'gids6082_db'

        });
        return connection;
    }
}]