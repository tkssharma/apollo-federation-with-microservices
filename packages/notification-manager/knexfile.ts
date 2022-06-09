export default {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test')
      ? { rejectUnauthorized: false }
      : false,
  },
  migrations: {
    directory: './src/storage/database/migrations',
  },
  seeds: {
    directory: './src/storage/database/seeders',
  },
};
