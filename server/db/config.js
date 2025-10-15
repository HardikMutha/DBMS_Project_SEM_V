import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_PROVIDER,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export const getDBConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    return null;
  }
};

export default pool;
