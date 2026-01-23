import pkg from 'pg';

const { Pool } = pkg;

// Create a pool of connections to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Event listener: fires when a new client connects
pool.on('connect', () => {
  console.log('Connected to the database');
});

// Event Listener: fires on onexpected errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});


export default pool;