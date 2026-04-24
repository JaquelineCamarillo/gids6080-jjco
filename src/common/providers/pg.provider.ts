export const pgProvider = [{
    provide: 'PG_CONNECTION',
    useFactory: async () => {
        const { Client } = require('pg');
        const client = new Client({
            host: 'localhost', 
            port: 5432,
            user: 'postgres', 
            password: '12052005', 
            database: 'gids6082_db' 
        });

        await client.connect();

        return client;
    }
}];